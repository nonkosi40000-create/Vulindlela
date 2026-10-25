import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticate } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })),
});

router.post('/profile-chat', authenticate, async (req, res) => {
  try {
    const { message, history } = chatSchema.parse(req.body);
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    const prompt = `
      You are Vula, a friendly South African opportunity guide.
      Goal: Build a structured profile for a young person (15-34) from informal talk.
      Rules:
      1. Use simple, warm language.
      2. Convert informal tasks (e.g., "I wash cars", "I help at the spaza") into skills.
      3. Ask ONE short question at a time.
      4. Detect if they mention name, area, skills, or availability.
      5. If you have enough info, output a JSON block starting with {PROFILE_DATA} at the end of your response.
      6. Languages: Respond in the user's current language preference.

      Current Profile: ${JSON.stringify(user?.profile || {})}
      User Message: ${message}
    `;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // Check for profile data extraction
    if (text.includes('{PROFILE_DATA}')) {
      try {
        const jsonStr = text.split('{PROFILE_DATA}')[1].trim();
        const profileData = JSON.parse(jsonStr);

        await prisma.profile.upsert({
          where: { userId },
          create: {
            userId,
            fullName: profileData.fullName || 'Anonymous',
            area: profileData.area || 'Unknown',
            skills: profileData.skills || [],
            informalExp: profileData.informalExp,
          },
          update: {
            fullName: profileData.fullName,
            area: profileData.area,
            skills: profileData.skills,
            informalExp: profileData.informalExp,
          }
        });

        if (profileData.isComplete) {
          await prisma.user.update({
            where: { id: userId },
            data: { isProfileComplete: true }
          });
        }
      } catch (e) {
        console.error("Failed to parse profile data from AI", e);
      }
    }

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

router.post('/scam-check', authenticate, async (req, res) => {
  const { text } = req.body;
  const prompt = `
    Analyze this job listing or message for scams.
    Look for red flags: paying for registration, sending bank details, ID copy requests, "easy money".
    Return a JSON: { riskLevel: "Safe" | "Warning" | "Danger", reasons: string[], explanation: string }
    Text to analyze: "${text}"
  `;
  const result = await model.generateContent(prompt);
  res.json(JSON.parse(result.response.text().replace(/```json|```/g, '')));
});

router.post('/simplify', authenticate, async (req, res) => {
  try {
    const { text, language } = req.body;
    const prompt = `
      Explain the following text in very simple words (Grade 6 reading level) for a young job seeker in South Africa.
      Use helpful analogies if appropriate. Respond in ${language}.

      Text: "${text}"
    `;
    const result = await model.generateContent(prompt);
    res.json({ simplifiedText: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: 'Simplification failed' });
  }
});

router.post('/mentor-match', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    const mentors = await prisma.user.findMany({
      where: { role: 'MENTOR' },
      include: { profile: true },
      take: 3
    });

    const prompt = `
      Match this user with the best mentor from the list.
      User Profile: ${JSON.stringify(user?.profile)}
      Mentors: ${JSON.stringify(mentors)}

      Return a JSON: { mentorId: string, reason: string, icebreaker: string }
    `;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text().replace(/```json|```/g, '')));
  } catch (err) {
    res.status(500).json({ error: 'Mentor matching failed' });
  }
});

export default router;
