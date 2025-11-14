import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../types';

const router = Router();
const prisma = new PrismaClient();

// GET /api/admin/creators/pending - Get pending creator profiles
router.get('/creators/pending', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pendingCreators = await prisma.creatorProfile.findMany({
      where: { approvedByAdmin: false },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const response: ApiResponse = {
      success: true,
      data: pendingCreators,
    };

    res.json(response);
  } catch (error) {
    console.error('Get pending creators error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get pending creators',
    });
  }
});

// PATCH /api/admin/creators/:id/approve - Approve a creator
router.patch('/creators/:id/approve', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const creatorProfileId = req.params.id;

    const creatorProfile = await prisma.creatorProfile.findUnique({
      where: { id: creatorProfileId },
    });

    if (!creatorProfile) {
      res.status(404).json({
        success: false,
        error: 'Creator profile not found',
      });
      return;
    }

    if (creatorProfile.approvedByAdmin) {
      res.status(400).json({
        success: false,
        error: 'Creator is already approved',
      });
      return;
    }

    // Approve the creator
    const updatedProfile = await prisma.creatorProfile.update({
      where: { id: creatorProfileId },
      data: { approvedByAdmin: true },
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

    // Also mark user as verified
    await prisma.user.update({
      where: { id: creatorProfile.userId },
      data: { isVerified: true },
    });

    const response: ApiResponse = {
      success: true,
      data: updatedProfile,
      message: 'Creator approved successfully',
    };

    res.json(response);
  } catch (error) {
    console.error('Approve creator error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve creator',
    });
  }
});

export default router;

