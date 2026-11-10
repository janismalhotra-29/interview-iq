// Ultra-fast in-memory and sessionStorage cache for instant 0ms page navigation
const memoryCache: Record<string, { data: any; timestamp: number }> = {};

export function getCached<T = any>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  // 1. In-memory cache lookup (0ms instantaneous)
  const mem = memoryCache[key];
  if (mem && Date.now() - mem.timestamp < 300000) {
    return mem.data as T;
  }

  // 2. SessionStorage cache lookup (fast local disk)
  try {
    const raw = sessionStorage.getItem(`iq_cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < 300000) {
        memoryCache[key] = parsed;
        return parsed.data as T;
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
}

export function setCached(key: string, data: any): void {
  if (typeof window === 'undefined') return;
  const entry = { data, timestamp: Date.now() };
  memoryCache[key] = entry;
  try {
    sessionStorage.setItem(`iq_cache_${key}`, JSON.stringify(entry));
  } catch (e) {
    // ignore
  }
}

export function clearCached(prefix?: string): void {
  if (typeof window === 'undefined') return;
  if (!prefix) {
    Object.keys(memoryCache).forEach((k) => delete memoryCache[k]);
    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith('iq_cache_'))
        .forEach((k) => sessionStorage.removeItem(k));
    } catch (e) {}
    return;
  }

  Object.keys(memoryCache).forEach((k) => {
    if (k.startsWith(prefix)) delete memoryCache[k];
  });
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(`iq_cache_${prefix}`))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch (e) {}
}

// Pre-seeded fallback data for instant 0ms initial render of demo accounts
export const DEFAULT_DEMO_ANALYTICS = {
  stats: {
    totalInterviewsCompleted: 5,
    averageScore: 82.7,
    readinessPercentage: 87,
    strongestSkill: {
      name: 'Full Stack Architecture',
      score: 88,
      description: 'Solid understanding of Virtual DOM, Fiber scheduling and concurrency',
    },
    areasForImprovement: {
      name: 'Distributed Consistency',
      score: 72,
      description: 'Requires practice on 2PC, Saga patterns, and idempotent retry edge cases',
    },
  },
  charts: {
    radarData: [
      { subject: 'Technical Accuracy', score: 85, fullMark: 100 },
      { subject: 'Relevance', score: 88, fullMark: 100 },
      { subject: 'Communication', score: 82, fullMark: 100 },
      { subject: 'Completeness', score: 80, fullMark: 100 },
      { subject: 'Problem Solving', score: 84, fullMark: 100 },
    ],
    historyTrend: [
      { index: 1, title: 'JavaScript & Async', date: 'Oct 23', score: 78, role: 'Frontend Developer', difficulty: 'Medium', timeTaken: 16 },
      { index: 2, title: 'REST API & Postgres', date: 'Oct 27', score: 81, role: 'Backend Developer', difficulty: 'Medium', timeTaken: 18 },
      { index: 3, title: 'Distributed Cache', date: 'Nov 01', score: 83, role: 'System Design', difficulty: 'Hard', timeTaken: 22 },
      { index: 4, title: 'STAR Behavioral', date: 'Nov 04', score: 86, role: 'Behavioral / HR', difficulty: 'Medium', timeTaken: 15 },
      { index: 5, title: 'Full Stack Architecture', date: 'Nov 07', score: 88, role: 'Full Stack Developer', difficulty: 'Hard', timeTaken: 19 },
    ],
  },
  recentInterviews: [
    {
      id: 's-001',
      title: 'Full Stack Architecture & React Deep Dive',
      job_role: 'Full Stack Developer',
      difficulty: 'Hard',
      overall_score: 88,
      status: 'completed',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 's-002',
      title: 'STAR Behavioral & Team Leadership',
      job_role: 'Behavioral / HR',
      difficulty: 'Medium',
      overall_score: 86,
      status: 'completed',
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 's-003',
      title: 'Distributed Cache & Scalability',
      job_role: 'System Design',
      difficulty: 'Hard',
      overall_score: 83,
      status: 'completed',
      created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    },
  ],
  recommendations: [
    {
      id: 'rec-1',
      topic: 'Distributed Transactions & Saga Pattern',
      category: 'System Design',
      difficulty: 'Hard',
      description: 'Master choreography vs orchestration in microservices with compensating transactions.',
      resource_url: 'https://microservices.io/patterns/data/saga.html',
      is_completed: false,
    },
    {
      id: 'rec-2',
      topic: 'React 18 Concurrent Rendering & useTransition',
      category: 'Frontend Deep Dive',
      difficulty: 'Medium',
      description: 'Practice time-slicing and avoiding layout thrashing during heavy UI re-renders.',
      resource_url: 'https://react.dev/reference/react/useTransition',
      is_completed: false,
    },
    {
      id: 'rec-3',
      topic: 'PostgreSQL Isolation Levels & SELECT FOR UPDATE',
      category: 'Database Concurrency',
      difficulty: 'Hard',
      description: 'Prevent lost updates and phantom reads in high-concurrency payment tables.',
      resource_url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
      is_completed: false,
    },
    {
      id: 'rec-4',
      topic: 'STAR Technique for Conflict Resolution',
      category: 'Behavioral / HR',
      difficulty: 'Easy',
      description: 'Structure answers with quantifiable metrics: Situation, Task, Action, Result.',
      resource_url: 'https://www.themuse.com/advice/star-interview-method',
      is_completed: true,
    },
  ],
  badges: [
    {
      id: 'b-1',
      badge_key: 'first_interview',
      title: 'First Step',
      description: 'Completed your very first AI mock interview session!',
      icon: 'Award',
      unlocked_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    },
    {
      id: 'b-2',
      badge_key: 'high_scorer',
      title: 'Top Performer',
      description: 'Scored above 85% on a challenging Technical Interview.',
      icon: 'Flame',
      unlocked_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
    {
      id: 'b-3',
      badge_key: 'streak_3',
      title: 'Consistency Master',
      description: 'Practiced interviews 3 days in a row.',
      icon: 'Zap',
      unlocked_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'b-4',
      badge_key: 'tech_guru',
      title: 'Technical Guru',
      description: 'Averaged 85%+ across Technical Accuracy evaluations.',
      icon: 'Cpu',
      unlocked_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ],
};

export const DEFAULT_DEMO_SESSIONS: any[] = [
  {
    id: 's-001',
    user_id: 'd0000000-0000-0000-0000-000000000001',
    title: 'Full Stack Architecture & React Deep Dive',
    job_role: 'Full Stack Developer',
    experience_level: 'Intermediate',
    interview_type: 'Technical',
    difficulty: 'Hard',
    question_count: 5,
    duration_minutes: 25,
    time_taken_seconds: 1140,
    status: 'completed',
    overall_score: 84.5,
    performance_status: 'Strong',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 3 * 86400000 + 19 * 60000).toISOString(),
  },
  {
    id: 's-002',
    user_id: 'd0000000-0000-0000-0000-000000000001',
    title: 'STAR Behavioral Leadership & Team Conflicts',
    job_role: 'Behavioral / HR',
    experience_level: 'Intermediate',
    interview_type: 'HR / Behavioral',
    difficulty: 'Medium',
    question_count: 4,
    duration_minutes: 20,
    time_taken_seconds: 900,
    status: 'completed',
    overall_score: 86.0,
    performance_status: 'Strong',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 6 * 86400000 + 15 * 60000).toISOString(),
  },
  {
    id: 's-003',
    user_id: 'd0000000-0000-0000-0000-000000000001',
    title: 'Distributed System Design & Microservice Scaling',
    job_role: 'System Design',
    experience_level: 'Senior',
    interview_type: 'System Design',
    difficulty: 'Hard',
    question_count: 4,
    duration_minutes: 30,
    time_taken_seconds: 1320,
    status: 'completed',
    overall_score: 83.0,
    performance_status: 'Strong',
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 9 * 86400000 + 22 * 60000).toISOString(),
  },
  {
    id: 's-004',
    user_id: 'd0000000-0000-0000-0000-000000000001',
    title: 'PostgreSQL Indexes & Concurrency Controls',
    job_role: 'Backend Developer',
    experience_level: 'Intermediate',
    interview_type: 'Technical',
    difficulty: 'Medium',
    question_count: 5,
    duration_minutes: 25,
    time_taken_seconds: 1080,
    status: 'completed',
    overall_score: 81.0,
    performance_status: 'Satisfactory',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 14 * 86400000 + 18 * 60000).toISOString(),
  },
  {
    id: 's-005',
    user_id: 'd0000000-0000-0000-0000-000000000001',
    title: 'Modern JavaScript & Async Concurrency',
    job_role: 'Frontend Developer',
    experience_level: 'Intermediate',
    interview_type: 'Technical',
    difficulty: 'Medium',
    question_count: 4,
    duration_minutes: 20,
    time_taken_seconds: 950,
    status: 'completed',
    overall_score: 85.5,
    performance_status: 'Strong',
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    completed_at: new Date(Date.now() - 18 * 86400000 + 16 * 60000).toISOString(),
  },
];
