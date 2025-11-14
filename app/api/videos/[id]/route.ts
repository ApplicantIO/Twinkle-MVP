import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
            bannerUrl: true,
            aboutText: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.video.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    // Record analytics
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    await prisma.analytics.create({
      data: {
        videoId: params.id,
        viewerIp: clientIp,
      },
    });

    return NextResponse.json({ video });
  } catch (error: any) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const video = await prisma.video.findUnique({
      where: { id: params.id },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    if (video.userId !== payload.id) {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (user?.role !== 'admin') {
        return NextResponse.json(
          { error: 'You can only edit your own videos' },
          { status: 403 }
        );
      }
    }

    const { title, description, category } = await request.json();

    const updated = await prisma.video.update({
      where: { id: params.id },
      data: {
        title: title || video.title,
        description: description !== undefined ? description : video.description,
        category: category !== undefined ? category : video.category,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ video: updated });
  } catch (error: any) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const video = await prisma.video.findUnique({
      where: { id: params.id },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    if (video.userId !== payload.id) {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (user?.role !== 'admin') {
        return NextResponse.json(
          { error: 'You can only delete your own videos' },
          { status: 403 }
        );
      }
    }

    await prisma.video.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}

