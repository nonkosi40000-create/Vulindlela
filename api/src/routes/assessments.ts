import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const assessmentSchema = z.object({
  skillName: z.string(),
});

const taskSchema = z.object({
  opportunityId: z.string(),
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  deliverableType: z.string(),
});

// Get user assessments
router.get('/my', authenticate, async (req, res) => {
  const assessments = await prisma.skillAssessment.findMany({
    where: { userId: req.user!.id }
  });
  res.json(assessments);
});

// Start a new skill assessment (Self-initiated)
router.post('/start', authenticate, async (req, res) => {
  try {
    const { skillName } = assessmentSchema.parse(req.body);
    const assessment = await prisma.skillAssessment.create({
      data: {
        userId: req.user!.id,
        skillName,
        status: 'IN_PROGRESS'
      }
    });
    res.json(assessment);
  } catch (err) {
    res.status(400).json({ error: 'Invalid assessment data' });
  }
});

// Submit evidence for assessment
router.post('/:id/submit', authenticate, async (req, res) => {
  const { id } = req.params;
  const { evidenceUrl } = req.body;

  const assessment = await prisma.skillAssessment.update({
    where: { id, userId: req.user!.id },
    data: {
      evidenceUrl,
      status: 'COMPLETED',
      completedAt: new Date()
    }
  });

  res.json(assessment);
});

// Get tasks for an opportunity
router.get('/tasks/:opportunityId', authenticate, async (req, res) => {
  const { opportunityId } = req.params;
  const tasks = await prisma.assessmentTask.findMany({
    where: { opportunityId }
  });
  res.json(tasks);
});

export default router;
