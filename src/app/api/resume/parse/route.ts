import { NextResponse } from 'next/server';
import { parseResumeContent } from '@/lib/resume-parser';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    const parsed = parseResumeContent(text);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to parse resume' }, { status: 500 });
  }
}
