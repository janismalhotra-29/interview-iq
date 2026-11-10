import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password, full_name, target_role, experience_level } = await req.json();

    if (!email || !full_name) {
      return NextResponse.json({ error: 'Full name and email are required' }, { status: 400 });
    }

    const existing = await db.getUser(email);
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const user = await db.createUser({
      email,
      full_name,
    });

    if (target_role || experience_level) {
      await db.updateUserProfile(user.id, {
        target_role: target_role || 'Software Developer',
        experience_level: experience_level || 'Intermediate',
      });
    }

    const profile = await db.getUserProfile(user.id);

    return NextResponse.json({
      success: true,
      user,
      profile,
      token: `mock_jwt_${user.id}_${Date.now()}`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
