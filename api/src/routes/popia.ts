import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';
import crypto from 'crypto';

const router = express.Router();

const consentSchema = z.object({
  purposes: z.object({
    processing: z.boolean(),
    employerShare: z.boolean(),
    alerts: z.boolean(),
  }),
  language: z.string(),
});

router.post('/accept', authenticate, async (req, res) => {
  try {
    const { purposes, language } = consentSchema.parse(req.body);
    const userId = req.user!.id;
    const ipHash = crypto.createHash('sha256').update(req.ip || '').digest('hex');

    const log = await prisma.consentLog.create({
      data: {
        userId,
        version: process.env.POPIA_VERSION || 'v1.0',
        language,
        purposes: purposes as any,
        ipHash,
      },
    });

    res.json({ success: true, logId: log.id });
  } catch (err) {
    res.status(400).json({ error: 'Invalid consent data' });
  }
});

router.get('/my-data', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      profile: true,
      consents: true,
      applications: { include: { opportunity: true } },
    },
  });

  if (!user) return res.status(404).json({ error: 'User not found' });

  // Filter out sensitive auth data before sending
  const { passwordHash, refreshTokenVersion, ...safeData } = user;
  res.json(safeData);
});

router.delete('/delete-account', authenticate, async (req, res) => {
  const userId = req.user!.id;

  // Permanent erasure as per POPIA "Right to be Forgotten"
  // In a real app, you might move this to a 'deleted_users' archive for audit logs
  // but POPIA requires actual deletion of PII unless there's a legal override.
  await prisma.user.delete({ where: { id: userId } });

  res.clearCookie('refreshToken');
  res.json({ message: 'Account and all personal data deleted successfully' });
});

export default router;
