import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../types';

const router = Router();
const prisma = new PrismaClient();

// GET /api/videos - Get all published videos (public endpoint)
router.get('/', async (req, res: Response): Promise<void> => {
  try {
    const videos = await prisma.video.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
            creatorProfile: {
              select: {
                bio: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const response: ApiResponse = {
      success: true,
      data: videos,
    };

    res.json(response);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get videos',
    });
  }
});

export default router;

