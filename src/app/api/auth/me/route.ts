import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'd0000000-0000-0000-0000-000000000001';

    const user = await db.getUser(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = await db.getUserProfile(userId);
    const badges = await db.getUserBadges(userId);

    return NextResponse.json({
      user,
      profile,
      badges,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const updatedProfile = await db.updateUserProfile(userId, updates);
    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update profile' }, { status: 500 });
  }
}
