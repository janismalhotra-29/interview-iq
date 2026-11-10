import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const session = await db.getInterviewSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch interview session' }, { status: 500 });
  }
}
