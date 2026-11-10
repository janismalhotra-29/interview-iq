import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aggregateSessionSummary } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, userId = 'd0000000-0000-0000-0000-000000000001', timeTakenSeconds = 900 } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await db.getInterviewSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Collect all question evaluations
    const questionEvaluations = (session.questions || [])
      .map((q) => q.evaluation)
      .filter((e): e is NonNullable<typeof e> => Boolean(e));

    const summary = aggregateSessionSummary(questionEvaluations);

    // Complete session in database
    await db.completeInterviewSession(
      sessionId,
      summary.overall_score,
      summary.performance_status,
      timeTakenSeconds
    );

    // Update user's persistent skill analytics
    await db.updateSkillAnalytics(userId, {
      technical: summary.technical_accuracy_avg,
      relevance: summary.relevance_avg,
      communication: summary.communication_avg,
      completeness: summary.completeness_avg,
      problemSolving: summary.problem_solving_avg,
    });

    // Generate personalized learning recommendations based on weaknesses and missing concepts
    const generatedRecommendations = [];
    if (summary.technical_accuracy_avg < 80) {
      generatedRecommendations.push({
        topic: `${session.job_role} Core Architecture & Edge Cases`,
        category: 'Technical Revision' as const,
        difficulty: 'Medium' as const,
        description: `Review fundamental algorithms and internal runtime mechanics observed in ${session.title}. Focus on failure modes and boundary conditions.`,
        resource_url: 'https://github.com/donnemartin/system-design-primer',
      });
    }

    if (summary.communication_avg < 82) {
      generatedRecommendations.push({
        topic: 'STAR Method & Executive Communication',
        category: 'Communication Exercise' as const,
        difficulty: 'Medium' as const,
        description: 'Practice formulating answers starting with a 1-sentence high-level summary, followed by 3 structured points and quantifiable metrics.',
        resource_url: 'https://hbr.org/2021/02/how-to-answer-behavioral-interview-questions',
      });
    }

    if (summary.problem_solving_avg < 85) {
      generatedRecommendations.push({
        topic: 'Algorithmic Tradeoffs & Computational Complexity',
        category: 'Coding Practice' as const,
        difficulty: 'Hard' as const,
        description: 'Solve 3 medium-to-hard LeetCode problems focusing on space-time optimization and explaining your thought process out loud.',
        resource_url: 'https://leetcode.com/problemset/all/',
      });
    }

    if (generatedRecommendations.length > 0) {
      await db.addLearningRecommendations(userId, sessionId, generatedRecommendations);
    }

    const updatedSession = await db.getInterviewSession(sessionId);

    return NextResponse.json({
      success: true,
      summary,
      session: updatedSession,
    });
  } catch (err: any) {
    console.error('Error finalizing session evaluation:', err);
    return NextResponse.json({ error: err.message || 'Failed to finalize session' }, { status: 500 });
  }
}
