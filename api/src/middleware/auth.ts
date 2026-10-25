import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token expired or invalid' });
  }
};

export const requireConsent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const consent = await prisma.consentLog.findFirst({
    where: {
      userId: req.user.id,
      version: process.env.POPIA_VERSION || 'v1.0'
    },
    orderBy: { timestamp: 'desc' }
  });

  if (!consent || !(consent.purposes as any).processing) {
    return res.status(403).json({
      error: 'POPIA_CONSENT_REQUIRED',
      message: 'You must accept the privacy policy to continue.'
    });
  }
  next();
};
