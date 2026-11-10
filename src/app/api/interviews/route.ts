import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateInterviewQuestions } from '@/lib/ai-service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'd0000000-0000-0000-0000-000000000001';

    const sessions = await db.listUserSessions(userId);
    return NextResponse.json({ sessions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list interviews' }, { status: 500 });
  }
}

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
      durationMinutes = 20,
      resumeContext = '',
    } = body;

    // Check if user has custom API key in profile
    const profile = await db.getUserProfile(userId);
    const customApiKey = profile?.custom_gemini_key || profile?.custom_openai_key;

    // Generate questions using AI engine
    const generatedQuestions = await generateInterviewQuestions({
      jobRole,
      experienceLevel,
      interviewType,
      difficulty,
      questionCount: Number(questionCount) || 5,
      resumeContext,
      customApiKey,
    });

    // Create session in DB
    const session = await db.createInterviewSession(
      {
        user_id: userId,
        title: `${jobRole} ${interviewType} Assessment`,
        job_role: jobRole,
        experience_level: experienceLevel,
        interview_type: interviewType,
        difficulty,
        question_count: generatedQuestions.length,
        duration_minutes: Number(durationMinutes) || 20,
        resume_context: resumeContext,
      },
      generatedQuestions as Partial<any>[]
    );

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (err: any) {
    console.error('Error creating interview session:', err);
    return NextResponse.json({ error: err.message || 'Failed to create interview session' }, { status: 500 });
  }
}
