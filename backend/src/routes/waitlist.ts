import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { WaitlistRequest, ApiResponse } from '../types';

const router = Router();
const prisma = new PrismaClient();

// POST /api/waitlist - Submit waitlist interest
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userEmail, interestedIn, note }: WaitlistRequest = req.body;

    if (!userEmail || !interestedIn) {
      res.status(400).json({
        success: false,
        error: 'Email and interest type are required',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
      return;
    }

    const waitlistEntry = await prisma.waitlistInterest.create({
      data: {
        userEmail,
        interestedIn,
        note,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: waitlistEntry,
      message: 'Successfully added to waitlist',
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Waitlist error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add to waitlist',
    });
  }
});

export default router;

