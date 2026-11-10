import { NextResponse } from 'next/server';
import { generateInterviewQuestions } from '@/lib/ai-service';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId = 'd0000000-0000-0000-0000-000000000001',
      jobRole = 'Software Developer',
      experienceLevel = 'Intermediate',
      interviewType = 'Technical',
      difficulty = 'Medium',
      questionCount = 5,
      resumeContext = '',
    } = body;

    const profile = await db.getUserProfile(userId);
    const customApiKey = profile?.custom_gemini_key || profile?.custom_openai_key;

    const questions = await generateInterviewQuestions({
      jobRole,
      experienceLevel,
      interviewType,
      difficulty,
      questionCount: Number(questionCount) || 5,
      resumeContext,
      customApiKey,
    });

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Question generation failed' }, { status: 500 });
  }
}
