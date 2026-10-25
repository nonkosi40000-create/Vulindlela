import express from 'express';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { z } from 'zod';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const router = express.Router();

const otpLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60 * 60, // per hour
});

const loginSchema = z.object({
  mobile: z.string().regex(/^0[0-9]{9}$/), // South African mobile format
});

const verifyOtpSchema = z.object({
  mobile: z.string().regex(/^0[0-9]{9}$/),
  otp: z.string().length(6),
});

// Mock OTP storage (In production, use Redis with TTL)
const otpStore = new Map<string, { otp: string; expires: number }>();

router.post('/otp/request', async (req, res) => {
  try {
    const { mobile } = loginSchema.parse(req.body);

    await otpLimiter.consume(mobile);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 mins

    otpStore.set(mobile, { otp, expires });

    // In production: Send via SMS/WhatsApp provider
    console.log(`[AUTH] OTP for ${mobile}: ${otp}`);

    res.json({ message: 'OTP sent successfully' });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(429).json({ error: 'Too many requests. Try again later.' });
  }
});

router.post('/otp/verify', async (req, res) => {
  try {
    const { mobile, otp } = verifyOtpSchema.parse(req.body);
    const stored = otpStore.get(mobile);

    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    otpStore.delete(mobile);

    let user = await prisma.user.findUnique({ where: { mobile } });

    if (!user) {
      user = await prisma.user.create({
        data: { mobile, role: 'JOBSEEKER' },
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, version: user.refreshTokenVersion },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: { id: user.id, mobile: user.mobile, role: user.role, isProfileComplete: user.isProfileComplete }
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      await prisma.user.update({
        where: { id: decoded.id },
        data: { refreshTokenVersion: { increment: 1 } },
      });
    } catch (e) {}
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export default router;
