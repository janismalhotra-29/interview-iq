import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let user = await db.getUser(email);

    // If user does not exist in local db, create a default user for demonstration convenience
    if (!user) {
      const namePart = email.split('@')[0];
      const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      user = await db.createUser({
        email,
        full_name: fullName,
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
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
