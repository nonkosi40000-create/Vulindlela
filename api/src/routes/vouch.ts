import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const vouchSchema = z.object({
  recipientId: z.string(),
  skill: z.string(),
  relationship: z.string(),
  comment: z.string(),
});

// Generate a referral link for a user
router.get('/referral-link', authenticate, async (req, res) => {
  // In a real app, this might be a signed URL or a short link
  const link = `${process.env.FRONTEND_URL}/vouch/${req.user!.id}`;
  res.json({ link });
});

// Submit a vouch (public endpoint or authenticated?)
// Requirement C: Unique referral links for mentors, educators, etc.
// For MVP, we'll allow authenticated users to vouch for others.
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { recipientId, skill, relationship, comment } = vouchSchema.parse(req.body);

    if (recipientId === req.user!.id) {
        return res.status(400).json({ error: "You cannot vouch for yourself" });
    }

    const vouch = await prisma.vouch.create({
      data: {
        recipientId,
        giverId: req.user!.id,
        skill,
        relationship,
        comment,
      }
    });

    res.json(vouch);
  } catch (err) {
    res.status(400).json({ error: 'Invalid vouch data' });
  }
});

// Get vouches received by the user
router.get('/my-vouches', authenticate, async (req, res) => {
  const vouches = await prisma.vouch.findMany({
    where: { recipientId: req.user!.id },
    include: {
      giver: {
        select: {
          profile: {
            select: { fullName: true }
          },
          role: true
        }
      }
    }
  });
  res.json(vouches);
});

export default router;
