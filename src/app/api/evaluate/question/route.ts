import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { evaluateAnswer, determineFollowupQuestion } from '@/lib/ai-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      sessionId,
      questionId,
      userId = 'd0000000-0000-0000-0000-000000000001',
      answerText,
      inputMethod = 'text',
      timeSpentSeconds = 60,
    } = body;

    if (!sessionId || !questionId || !answerText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await db.getInterviewSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
    }

    let question = session.questions?.find((q) => q.id === questionId);
    if (!question) {
      question = session.questions?.[0] || {
        id: questionId,
        session_id: sessionId,
        question_number: 1,
        category: 'React Internals',
        question_text: 'How does React’s Virtual DOM and Reconciliation algorithm work, and how does the React 18 Fiber architecture enable concurrent rendering?',
        expected_concepts: ['Virtual DOM', 'Reconciliation', 'Fiber Node', 'Time Slicing', 'useTransition'],
        difficulty: 'Hard',
      };
    }

    // Save the answer
    await db.saveInterviewAnswer({
      session_id: sessionId,
      question_id: questionId,
      user_id: userId,
      answer_text: answerText,
      input_method: inputMethod,
      time_spent_seconds: timeSpentSeconds,
    });

    const profile = await db.getUserProfile(userId);
    const customApiKey = profile?.custom_gemini_key || profile?.custom_openai_key;

    // Evaluate answer with the 5 weighted parameters
    const evaluationData = await evaluateAnswer({
      questionText: question.question_text,
      expectedConcepts: question.expected_concepts,
      candidateAnswer: answerText,
      jobRole: session.job_role,
      difficulty: session.difficulty,
      interviewType: session.interview_type,
      customApiKey,
    });

    // Save evaluation result
    const savedEval = await db.saveEvaluationResult({
      session_id: sessionId,
      question_id: questionId,
      user_id: userId,
      ...evaluationData,
    });

    // Check if dynamic follow-up is warranted (only if this question wasn't already a follow-up)
    let followupQuestion = null;
    if (!question.is_followup) {
      const followupDecision = await determineFollowupQuestion(
        question.question_text,
        answerText,
        session.job_role
      );

      if (followupDecision.shouldAskFollowup && followupDecision.followupQuestion) {
        followupQuestion = await db.addFollowupQuestion(
          sessionId,
          questionId,
          followupDecision.followupQuestion,
          followupDecision.expectedConcepts || []
        );
      }
    }

    return NextResponse.json({
      success: true,
      evaluation: savedEval,
      followupQuestion,
    });
  } catch (err: any) {
    console.error('Error evaluating question:', err);
    return NextResponse.json({ error: err.message || 'Evaluation failed' }, { status: 500 });
  }
}
