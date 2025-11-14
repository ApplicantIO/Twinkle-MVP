import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { CreateCreatorProfileRequest, CreateVideoRequest, ApiResponse } from '../types';

const router = Router();
const prisma = new PrismaClient();

// POST /api/creator/profile - Create or update creator profile
router.post('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { bio, platformLinks, audienceSize, category }: CreateCreatorProfileRequest = req.body;

    // Update user role to CREATOR
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'CREATOR' },
    });

    // Create or update creator profile
    const creatorProfile = await prisma.creatorProfile.upsert({
      where: { userId },
      update: {
        bio,
        platformLinks,
        audienceSize: audienceSize || 0,
        category,
      },
      create: {
        userId,
        bio,
        platformLinks,
        audienceSize: audienceSize || 0,
        category,
        approvedByAdmin: false,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    const response: ApiResponse = {
      success: true,
      data: creatorProfile,
    };

    res.json(response);
  } catch (error) {
    console.error('Create creator profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create creator profile',
    });
  }
});

// GET /api/creator/profile/me - Get current user's creator profile
router.get('/profile/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    if (!creatorProfile) {
      res.status(404).json({
        success: false,
        error: 'Creator profile not found',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: creatorProfile,
    };

    res.json(response);
  } catch (error) {
    console.error('Get creator profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get creator profile',
    });
  }
});

// POST /api/videos - Create a new video
router.post('/videos', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { title, description, videoUrl, thumbnailUrl, tags, status }: CreateVideoRequest = req.body;

    if (!title || !videoUrl) {
      res.status(400).json({
        success: false,
        error: 'Title and video URL are required',
      });
      return;
    }

    // Check if user is a creator and approved
    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { userId },
    });

    if (!creatorProfile || !creatorProfile.approvedByAdmin) {
      res.status(403).json({
        success: false,
        error: 'Only approved creators can upload videos',
      });
      return;
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        tags: tags || [],
        status: status || 'DRAFT',
        creatorId: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const response: ApiResponse = {
      success: true,
      data: video,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create video',
    });
  }
});

// GET /api/videos/me - Get videos for logged-in creator
router.get('/videos/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const videos = await prisma.video.findMany({
      where: { creatorId: userId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
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
    console.error('Get my videos error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get videos',
    });
  }
});

export default router;

