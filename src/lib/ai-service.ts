import { BankQuestion, QUESTION_BANK } from './question-bank';
import { QuestionEvaluation, SessionEvaluationSummary } from '@/types';

// System prompt explaining the scoring framework and strict guidelines
const EVALUATION_SYSTEM_PROMPT = `You are the lead technical evaluator and AI interview coach for InterviewIQ.
Evaluate candidate interview answers with academic rigor, fairness, and constructive feedback.
You MUST calculate weighted scores strictly using these 5 parameters:
1. Technical Accuracy (30% weight) - Correctness of domain terminology, algorithms, mechanisms, and factual statements.
2. Relevance (25% weight) - Direct responsiveness to the prompt without drifting or fluff.
3. Communication (20% weight) - Structural clarity, conciseness, articulation of tradeoffs, and professional vocabulary.
4. Completeness (15% weight) - Coverage of edge cases, implementation specifics, and depth.
5. Problem-Solving Approach (10% weight) - Methodical thinking, architectural reasoning, and justification of choices.

IMPORTANT ETHICAL REQUIREMENT:
Clearly distinguish linguistic and conceptual estimates from psychological traits. Never claim to measure personality, emotional confidence, or absolute employability from text alone.

Return valid JSON with the exact specified schema.`;

export interface GenerateQuestionsInput {
  jobRole: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  questionCount: number;
  resumeContext?: string;
  customApiKey?: string;
}

export interface EvaluateAnswerInput {
  questionText: string;
  expectedConcepts?: string[];
  candidateAnswer: string;
  jobRole: string;
  difficulty: string;
  interviewType: string;
  customApiKey?: string;
}

export interface FollowupDecision {
  shouldAskFollowup: boolean;
  followupQuestion?: string;
  expectedConcepts?: string[];
  reason?: string;
}

/**
 * Generate interview questions using Gemini / OpenAI or smart curated fallback bank
 */
export async function generateInterviewQuestions(input: GenerateQuestionsInput): Promise<Array<{
  question_text: string;
  category: string;
  expected_concepts: string[];
  difficulty: string;
}>> {
  const apiKey = input.customApiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `Generate ${input.questionCount} interview questions for a ${input.experienceLevel} ${input.jobRole}.
Interview Type: ${input.interviewType}.
Difficulty: ${input.difficulty}.
${input.resumeContext ? `Candidate Resume Background:\n${input.resumeContext}\nTailor at least 2 questions directly to the candidate's highlighted projects, skills, or tech stack.` : ''}

Return a valid JSON array of objects with the following schema:
[
  {
    "question_text": "string",
    "category": "string (e.g. Distributed Systems, React State, System Design, Behavioral)",
    "expected_concepts": ["concept 1", "concept 2", "concept 3", "concept 4"],
    "difficulty": "${input.difficulty}"
  }
]
Output ONLY raw JSON, with no markdown code blocks.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.7 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, input.questionCount);
          }
        }
      }
    } catch (err) {
      console.warn('Gemini question generation failed, falling back to curated bank:', err);
    }
  }

  // Fallback generation: Smart contextual filtering from question bank
  const roleLower = input.jobRole.toLowerCase();
  const typeLower = input.interviewType.toLowerCase();

  let matches = QUESTION_BANK.filter(q => 
    q.role.toLowerCase().includes(roleLower) ||
    roleLower.includes(q.role.toLowerCase()) ||
    q.type.toLowerCase() === typeLower
  );

  if (matches.length < input.questionCount) {
    const others = QUESTION_BANK.filter(q => !matches.includes(q));
    matches = [...matches, ...others];
  }

  // If candidate provided resume context, adapt the first question to mention their resume tech
  const results = matches.slice(0, input.questionCount).map((q, idx) => {
    let questionText = q.question;
    let category = q.category;
    let expectedConcepts = [...q.expectedConcepts];

    if (input.resumeContext && idx === 0) {
      // Extract top technology from resume if possible
      const matchTech = input.resumeContext.match(/(React|Node\.js|Python|TypeScript|PostgreSQL|AWS|Docker|Kubernetes|PyTorch|GraphQL)/i);
      if (matchTech) {
        questionText = `Based on your resume experience with ${matchTech[0]}, can you walk us through how you designed or optimized a mission-critical component in one of your recent projects?`;
        category = `Resume Deep Dive: ${matchTech[0]}`;
        expectedConcepts = [`Architecture and role of ${matchTech[0]}`, 'Performance tradeoffs', 'Production challenges overcome', 'Measurable impact'];
      }
    }

    return {
      question_text: questionText,
      category,
      expected_concepts: expectedConcepts,
      difficulty: q.difficulty || input.difficulty
    };
  });

  return results;
}

/**
 * Check if candidate's answer needs a dynamic follow-up question
 */
export async function determineFollowupQuestion(
  questionText: string,
  answerText: string,
  jobRole: string
): Promise<FollowupDecision> {
  const trimmed = answerText.trim();
  const wordCount = trimmed.split(/\s+/).length;

  // If answer is too short (less than 25 words) or missing depth, ask for elaboration
  if (wordCount >= 10 && wordCount < 35) {
    return {
      shouldAskFollowup: true,
      followupQuestion: `You gave a brief overview. Could you dive deeper into the specific trade-offs or failure modes you would consider in a production environment for this scenario?`,
      expectedConcepts: ['Production edge cases', 'Latency or memory tradeoffs', 'Error handling'],
      reason: 'Candidate provided a concise answer that warrants technical elaboration.'
    };
  }

  // If answer discusses architecture without metrics
  if (wordCount >= 35 && !trimmed.toLowerCase().includes('time') && !trimmed.toLowerCase().includes('complexity') && !trimmed.toLowerCase().includes('scale')) {
    return {
      shouldAskFollowup: true,
      followupQuestion: `Great start. How would this approach scale under 10x traffic, and what are the time or space complexities involved?`,
      expectedConcepts: ['Scalability limits', 'Computational complexity', 'Resource bottlenecks'],
      reason: 'Deep dive into computational complexity and high-scale traffic behavior.'
    };
  }

  return { shouldAskFollowup: false };
}

/**
 * Evaluate a single answer based strictly on the 5 weighted parameters
 */
export async function evaluateAnswer(input: EvaluateAnswerInput): Promise<Omit<QuestionEvaluation, 'session_id' | 'question_id' | 'user_id'>> {
  const apiKey = input.customApiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `${EVALUATION_SYSTEM_PROMPT}

Question: "${input.questionText}"
Expected Concepts: ${JSON.stringify(input.expectedConcepts || [])}
Job Role: ${input.jobRole}
Difficulty: ${input.difficulty}
Candidate's Answer: "${input.candidateAnswer}"

Analyze this answer and output JSON with this exact structure:
{
  "technical_accuracy_score": number (0-100),
  "relevance_score": number (0-100),
  "communication_score": number (0-100),
  "completeness_score": number (0-100),
  "problem_solving_score": number (0-100),
  "answer_quality_analysis": "2-3 sentences analyzing strengths and gaps",
  "model_answer_suggestion": "Exemplary answer incorporating best practices",
  "missing_concepts": ["concept 1", "concept 2"],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["gap 1", "gap 2"],
  "improvement_recommendations": ["recommendation 1", "recommendation 2"]
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          const tech = Math.min(100, Math.max(0, Number(parsed.technical_accuracy_score) || 75));
          const rel = Math.min(100, Math.max(0, Number(parsed.relevance_score) || 75));
          const comm = Math.min(100, Math.max(0, Number(parsed.communication_score) || 75));
          const comp = Math.min(100, Math.max(0, Number(parsed.completeness_score) || 70));
          const ps = Math.min(100, Math.max(0, Number(parsed.problem_solving_score) || 75));

          const weightedTotal = Number(
            (tech * 0.30 + rel * 0.25 + comm * 0.20 + comp * 0.15 + ps * 0.10).toFixed(1)
          );

          return {
            technical_accuracy_score: tech,
            relevance_score: rel,
            communication_score: comm,
            completeness_score: comp,
            problem_solving_score: ps,
            weighted_total_score: weightedTotal,
            answer_quality_analysis: parsed.answer_quality_analysis || 'Candidate demonstrated competent fundamental awareness.',
            model_answer_suggestion: parsed.model_answer_suggestion || 'Review system constraints and edge-case handling.',
            missing_concepts: parsed.missing_concepts || [],
            strengths: parsed.strengths || ['Relevant topic coverage'],
            weaknesses: parsed.weaknesses || ['Could provide more concrete architectural trade-offs'],
            improvement_recommendations: parsed.improvement_recommendations || ['Practice structuring answers with first principles.'],
            is_ai_generated_estimate: true,
          };
        }
      }
    } catch (err) {
      console.warn('Gemini evaluation API error, applying deterministic semantic rubric:', err);
    }
  }

  // --- DETERMINISTIC SEMANTIC NLP EVALUATION ENGINE ---
  // If API key is not configured or network call fails, evaluate answer against expected concepts,
  // vocabulary density, structure, length, and technical clarity.
  return evaluateWithSemanticRubric(input);
}

function evaluateWithSemanticRubric(input: EvaluateAnswerInput): Omit<QuestionEvaluation, 'session_id' | 'question_id' | 'user_id'> {
  const answer = (input.candidateAnswer || '').trim();
  const words = answer.toLowerCase().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 5) {
    return {
      technical_accuracy_score: 20,
      relevance_score: 25,
      communication_score: 25,
      completeness_score: 15,
      problem_solving_score: 20,
      weighted_total_score: 21.5,
      answer_quality_analysis: 'The response was too brief to demonstrate technical competence or problem-solving capability.',
      model_answer_suggestion: 'Provide structured responses introducing the core mechanism, architectural decisions, and trade-offs.',
      missing_concepts: input.expectedConcepts || ['Foundational principles', 'System tradeoffs', 'Implementation details'],
      strengths: ['Prompt acknowledgement'],
      weaknesses: ['Extremely short answer lacking explanation', 'No technical depth provided'],
      improvement_recommendations: ['Elaborate using the STAR technique or structured component breakdown.'],
      is_ai_generated_estimate: true,
    };
  }

  const expected = (input.expectedConcepts || []).map(c => c.toLowerCase());
  let conceptsMatched = 0;
  const missingConcepts: string[] = [];
  const strengths: string[] = [];

  expected.forEach(c => {
    const keywords = c.split(/[\s,()\/]+/).filter(k => k.length > 3);
    const hasMatch = keywords.some(k => answer.toLowerCase().includes(k));
    if (hasMatch) {
      conceptsMatched++;
      strengths.push(`Clearly recognized key concept: ${c}`);
    } else {
      missingConcepts.push(c);
    }
  });

  const matchRatio = expected.length > 0 ? conceptsMatched / expected.length : 0.7;

  // Technical Accuracy (30% weight)
  let techScore = 65 + (matchRatio * 30);
  if (wordCount > 60) techScore += 5;
  techScore = Math.min(96, Math.max(30, Math.round(techScore)));

  // Relevance (25% weight)
  const questionWords = input.questionText.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const questionOverlap = questionWords.filter(w => answer.toLowerCase().includes(w)).length;
  let relevanceScore = 70 + Math.min(25, questionOverlap * 6);
  relevanceScore = Math.min(95, Math.max(35, Math.round(relevanceScore)));

  // Communication (20% weight)
  let commScore = 70;
  if (wordCount >= 40 && wordCount <= 250) commScore += 18;
  else if (wordCount > 250) commScore += 10;
  if (answer.includes('.') && answer.split('.').length >= 3) commScore += 7;
  commScore = Math.min(95, Math.max(40, Math.round(commScore)));

  // Completeness (15% weight)
  let completeScore = Math.round(50 + (matchRatio * 35) + (wordCount > 80 ? 12 : 5));
  completeScore = Math.min(95, Math.max(30, completeScore));

  // Problem-Solving Approach (10% weight)
  let psScore = 72;
  if (answer.toLowerCase().includes('because') || answer.toLowerCase().includes('tradeoff') || answer.toLowerCase().includes('scale') || answer.toLowerCase().includes('optimize')) {
    psScore += 18;
  }
  psScore = Math.min(94, Math.max(40, Math.round(psScore)));

  // Calculate strict weighted total
  const weightedTotal = Number(
    (techScore * 0.30 + relevanceScore * 0.25 + commScore * 0.20 + completeScore * 0.15 + psScore * 0.10).toFixed(1)
  );

  const weaknesses: string[] = [];
  if (missingConcepts.length > 0) {
    weaknesses.push(`Could explicitly discuss: ${missingConcepts.slice(0, 2).join(', ')}`);
  }
  if (wordCount < 40) {
    weaknesses.push('Response could benefit from deeper architectural justification and concrete examples.');
  }
  if (!answer.toLowerCase().includes('tradeoff') && !answer.toLowerCase().includes('complexity')) {
    weaknesses.push('Did not explicitly state operational or computational tradeoffs.');
  }

  const recommendations: string[] = [
    'Always articulate Big-O complexity or distributed failure recovery mechanisms early.',
    'Follow up assertions with concrete metrics (e.g., latency reduction, memory footprint, cache hit rates).'
  ];

  return {
    technical_accuracy_score: techScore,
    relevance_score: relevanceScore,
    communication_score: commScore,
    completeness_score: completeScore,
    problem_solving_score: psScore,
    weighted_total_score: weightedTotal,
    answer_quality_analysis: `Demonstrates ${weightedTotal >= 80 ? 'strong' : 'solid'} comprehension of the subject. Effectively covered ${conceptsMatched} of ${expected.length || 1} key theoretical domains with structured reasoning.`,
    model_answer_suggestion: `A comprehensive answer should state: 1) The exact architectural definition; 2) The core mechanism under the hood; 3) Tradeoffs against alternatives; and 4) Production monitoring or failure handling.`,
    missing_concepts: missingConcepts.length > 0 ? missingConcepts : ['Edge-case failure modes', 'Memory profiling'],
    strengths: strengths.length > 0 ? strengths : ['Clear intent', 'Relevant technical focus'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Could expand on high-concurrency scaling limits'],
    improvement_recommendations: recommendations,
    is_ai_generated_estimate: true,
  };
}

/**
 * Aggregate session evaluation across all questions
 */
export function aggregateSessionSummary(
  questionEvaluations: QuestionEvaluation[]
): SessionEvaluationSummary {
  if (!questionEvaluations.length) {
    return {
      overall_score: 0,
      performance_status: 'Needs Improvement',
      technical_accuracy_avg: 0,
      relevance_avg: 0,
      communication_avg: 0,
      completeness_avg: 0,
      problem_solving_avg: 0,
      total_questions_answered: 0,
      key_strengths: [],
      critical_areas_for_improvement: ['Complete interview questions to generate insights.'],
      general_feedback: 'No answers recorded for evaluation.',
      disclaimer: 'AI estimates reflect linguistic and technical heuristics and do not measure absolute employability or psychological attributes.',
      question_evaluations: [],
    };
  }

  const count = questionEvaluations.length;
  const techSum = questionEvaluations.reduce((acc, q) => acc + q.technical_accuracy_score, 0);
  const relSum = questionEvaluations.reduce((acc, q) => acc + q.relevance_score, 0);
  const commSum = questionEvaluations.reduce((acc, q) => acc + q.communication_score, 0);
  const compSum = questionEvaluations.reduce((acc, q) => acc + q.completeness_score, 0);
  const psSum = questionEvaluations.reduce((acc, q) => acc + q.problem_solving_score, 0);
  const totalSum = questionEvaluations.reduce((acc, q) => acc + q.weighted_total_score, 0);

  const overallScore = Number((totalSum / count).toFixed(1));
  const techAvg = Number((techSum / count).toFixed(1));
  const relAvg = Number((relSum / count).toFixed(1));
  const commAvg = Number((commSum / count).toFixed(1));
  const compAvg = Number((compSum / count).toFixed(1));
  const psAvg = Number((psSum / count).toFixed(1));

  let performanceStatus: 'Exceptional' | 'Strong' | 'Satisfactory' | 'Needs Improvement' = 'Satisfactory';
  if (overallScore >= 88) performanceStatus = 'Exceptional';
  else if (overallScore >= 78) performanceStatus = 'Strong';
  else if (overallScore >= 65) performanceStatus = 'Satisfactory';
  else performanceStatus = 'Needs Improvement';

  // Aggregate strengths & weaknesses
  const allStrengths = Array.from(new Set(questionEvaluations.flatMap(q => q.strengths))).slice(0, 5);
  const allWeaknesses = Array.from(new Set(questionEvaluations.flatMap(q => q.weaknesses))).slice(0, 5);

  let generalFeedback = '';
  if (overallScore >= 85) {
    generalFeedback = 'Exceptional interview performance. You exhibited deep domain mastery, disciplined articulation of engineering tradeoffs, and structured communication.';
  } else if (overallScore >= 75) {
    generalFeedback = 'Strong performance. You possess solid fundamental engineering foundations and communicated your ideas well. Continuing to sharpen edge-case analysis will elevate your interviews to top-tier standard.';
  } else {
    generalFeedback = 'Good effort with promising fundamentals. Focus on structuring answers before speaking, identifying failure modes, and referencing specific design patterns.';
  }

  return {
    overall_score: overallScore,
    performance_status: performanceStatus,
    technical_accuracy_avg: techAvg,
    relevance_avg: relAvg,
    communication_avg: commAvg,
    completeness_avg: compAvg,
    problem_solving_avg: psAvg,
    total_questions_answered: count,
    key_strengths: allStrengths,
    critical_areas_for_improvement: allWeaknesses,
    general_feedback: generalFeedback,
    disclaimer: 'Evaluation scores are automated AI approximations based on textual/verbal transcript analysis. They are intended for educational preparation and practice, distinguishing semantic heuristics from subjective employer hiring criteria.',
    question_evaluations: questionEvaluations,
  };
}
