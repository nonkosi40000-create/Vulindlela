import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.get('/', authenticate, async (req, res) => {
  const { type, area } = req.query;
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  });

  const opportunities = await prisma.opportunity.findMany({
    where: {
      isSuspended: false,
      ...(type ? { type: type as any } : {}),
      ...(area ? { location: { contains: area as string, mode: 'insensitive' } } : {}),
    }
  });

  // In a real production app, we would pre-calculate scores or use a vector search.
  // Here, we provide the raw list. The frontend or a separate task will call the Fit Score AI.
  res.json(opportunities);
});

router.post('/:id/fit-score', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const [opp, user] = await Promise.all([
    prisma.opportunity.findUnique({ where: { id } }),
    prisma.user.findUnique({ where: { id: userId }, include: { profile: true } })
  ]);

  if (!opp || !user?.profile) return res.status(404).json({ error: 'Not found' });

  const prompt = `
    Calculate an "Opportunity Fit Score" (0-100) for this user and opportunity.
    User Skills: ${user.profile.skills.join(', ')}
    User Area: ${user.profile.area}
    User Budget for taxi: R${user.profile.transportBudget || 0}

    Opportunity Title: ${opp.title}
    Opportunity Location: ${opp.location}
    Opportunity Stipend: R${opp.stipend || 0}
    Opportunity Est. Taxi Fare: R${opp.estimatedTaxi || 0}

    Rules:
    1. If Taxi Fare > Stipend/4, reduce score heavily.
    2. Explain the score in simple English (Grade 6 level).
    3. Suggest a "Near-Miss Bridge" (short course) if score is 50-75.

    Return JSON: { score: number, explanation: string, bridge: string | null }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '');
    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate fit score' });
  }
});

router.post('/:id/apply', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const existing = await prisma.application.findFirst({
    where: { userId, opportunityId: id }
  });

  if (existing) return res.status(400).json({ error: 'Already applied' });

  const app = await prisma.application.create({
    data: { userId, opportunityId: id }
  });

  res.json(app);
});

export default router;
