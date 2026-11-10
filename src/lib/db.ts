import fs from 'fs';
import path from 'path';
import {
  User,
  UserProfile,
  InterviewSession,
  InterviewQuestion,
  InterviewAnswer,
  QuestionEvaluation,
  SkillAnalytics,
  LearningRecommendation,
  UserBadge,
} from '@/types';

// Path for local persistent database storage
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'interview_iq_db.json');

interface DatabaseSchema {
  users: User[];
  user_profiles: UserProfile[];
  interview_sessions: InterviewSession[];
  interview_questions: InterviewQuestion[];
  interview_answers: InterviewAnswer[];
  evaluation_results: QuestionEvaluation[];
  skill_analytics: SkillAnalytics[];
  learning_recommendations: LearningRecommendation[];
  user_badges: UserBadge[];
}

function getInitialDbState(): DatabaseSchema {
  const demoUserId1 = 'd0000000-0000-0000-0000-000000000001';
  const demoUserId2 = 'd0000000-0000-0000-0000-000000000002';

  return {
    users: [
      {
        id: demoUserId1,
        email: 'alex.morgan@example.com',
        full_name: 'Alex Morgan',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'student',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: demoUserId2,
        email: 'priya.sharma@example.com',
        full_name: 'Priya Sharma',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        role: 'student',
        created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
    ],
    user_profiles: [
      {
        id: 'p-1',
        user_id: demoUserId1,
        target_role: 'Full Stack Developer',
        experience_level: 'Intermediate',
        target_companies: ['Google', 'Stripe', 'Vercel', 'Microsoft'],
        bio: 'Passionate software developer focusing on modern web apps, distributed systems, and scalable React & Node architectures.',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design', 'Docker'],
        preferred_language: 'English',
        theme_preference: 'light',
        total_interviews_completed: 5,
        average_score: 82.7,
      },
      {
        id: 'p-2',
        user_id: demoUserId2,
        target_role: 'AI/ML Engineer',
        experience_level: 'Advanced',
        target_companies: ['OpenAI', 'Anthropic', 'Google DeepMind'],
        bio: 'Machine learning researcher and engineer experienced with Transformers, PyTorch, RAG systems, and model optimization.',
        skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'MLOps', 'Vector Databases'],
        preferred_language: 'English',
        theme_preference: 'light',
        total_interviews_completed: 4,
        average_score: 88.0,
      },
    ],
    interview_sessions: [
      {
        id: 's-001',
        user_id: demoUserId1,
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
        user_id: demoUserId1,
        title: 'Frontend Engineering & Performance Optimization',
        job_role: 'Frontend Developer',
        experience_level: 'Intermediate',
        interview_type: 'Technical',
        difficulty: 'Medium',
        question_count: 4,
        duration_minutes: 20,
        time_taken_seconds: 890,
        status: 'completed',
        overall_score: 88.0,
        performance_status: 'Exceptional',
        created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
        completed_at: new Date(Date.now() - 6 * 86400000 + 15 * 60000).toISOString(),
      },
      {
        id: 's-003',
        user_id: demoUserId1,
        title: 'Engineering Leadership & Cross-Functional Teamwork',
        job_role: 'Software Developer',
        experience_level: 'Intermediate',
        interview_type: 'HR',
        difficulty: 'Medium',
        question_count: 4,
        duration_minutes: 15,
        time_taken_seconds: 720,
        status: 'completed',
        overall_score: 79.0,
        performance_status: 'Satisfactory',
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        completed_at: new Date(Date.now() - 10 * 86400000 + 12 * 60000).toISOString(),
      },
      {
        id: 's-004',
        user_id: demoUserId1,
        title: 'Distributed Systems & Database Scaling',
        job_role: 'Backend Developer',
        experience_level: 'Intermediate',
        interview_type: 'Technical',
        difficulty: 'Hard',
        question_count: 5,
        duration_minutes: 25,
        time_taken_seconds: 1280,
        status: 'completed',
        overall_score: 76.5,
        performance_status: 'Satisfactory',
        created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
        completed_at: new Date(Date.now() - 14 * 86400000 + 21 * 60000).toISOString(),
      },
      {
        id: 's-005',
        user_id: demoUserId1,
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
    ],
    interview_questions: [
      {
        id: 'q-s001-1',
        session_id: 's-001',
        question_number: 1,
        category: 'React Internals',
        question_text: 'How does React’s Virtual DOM and Reconciliation algorithm work, and how does the React 18 Fiber architecture enable concurrent rendering?',
        expected_concepts: ['Virtual DOM', 'Reconciliation O(n)', 'Fiber Tree', 'Time Slicing', 'useTransition'],
        difficulty: 'Hard',
      },
      {
        id: 'q-s001-2',
        session_id: 's-001',
        question_number: 2,
        category: 'Database Concurrency',
        question_text: 'How do you handle race conditions in high-concurrency payment or inventory updates? Compare Optimistic vs. Pessimistic locking.',
        expected_concepts: ['SELECT FOR UPDATE', 'Version column', 'Isolation Levels', 'Distributed Locks'],
        difficulty: 'Hard',
      },
      {
        id: 'q-s001-3',
        session_id: 's-001',
        question_number: 3,
        category: 'System Design',
        question_text: 'Design a real-time collaborative document editing tool. How do you handle concurrent conflicts between multiple users?',
        expected_concepts: ['CRDTs', 'Operational Transformation', 'WebSockets', 'Eventual Consistency'],
        difficulty: 'Hard',
      },
    ],
    interview_answers: [
      {
        id: 'ans-1',
        session_id: 's-001',
        question_id: 'q-s001-1',
        user_id: demoUserId1,
        answer_text: 'React uses a Virtual DOM which is an in-memory javascript representation of real DOM nodes. When state updates occur, it computes a diff using a tree reconciliation algorithm. With React 18 Fiber, the diffing is broken into small chunks of work that can be paused, resumed, or aborted based on priority using useTransition, preventing the UI from freezing during heavy operations.',
        input_method: 'text',
        time_spent_seconds: 180,
      },
      {
        id: 'ans-2',
        session_id: 's-001',
        question_id: 'q-s001-2',
        user_id: demoUserId1,
        answer_text: 'To avoid race conditions, we can use pessimistic locking like SELECT FOR UPDATE in SQL which locks rows until the transaction commits. Alternatively, optimistic locking uses a version number column; if the version has incremented when we try to commit, the query fails and retries. For microservices, we use distributed locks like Redis Redlock.',
        input_method: 'text',
        time_spent_seconds: 210,
      },
      {
        id: 'ans-3',
        session_id: 's-001',
        question_id: 'q-s001-3',
        user_id: demoUserId1,
        answer_text: 'We connect users via WebSockets and use Conflict-Free Replicated Data Types (CRDTs) like Yjs or Operational Transformation (OT) to resolve conflicting text insertions and deletions deterministically across all peers. Deltas are stored in Postgres or Cassandra and periodic snapshots saved to S3.',
        input_method: 'text',
        time_spent_seconds: 240,
      },
    ],
    evaluation_results: [
      {
        id: 'eval-1',
        session_id: 's-001',
        question_id: 'q-s001-1',
        user_id: demoUserId1,
        technical_accuracy_score: 88,
        relevance_score: 92,
        communication_score: 85,
        completeness_score: 80,
        problem_solving_score: 82,
        weighted_total_score: 86.4,
        answer_quality_analysis: 'Solid understanding of Virtual DOM and React 18 concurrent mechanics. Clearly explained Fiber scheduling and prioritization.',
        model_answer_suggestion: 'Mention specific Fiber node pointers (child, sibling, return) and how time-slicing yields to browser frames (requestIdleCallback / MessageChannel scheduler).',
        missing_concepts: ['Fiber node pointer structure', 'Browser microtask yielding scheduler'],
        strengths: ['Accurate explanation of reconciliation', 'Clear understanding of useTransition'],
        weaknesses: ['Did not mention exact pointer structure of Fiber nodes'],
        improvement_recommendations: ['Review React Fiber scheduler source code details.'],
        is_ai_generated_estimate: true,
      },
      {
        id: 'eval-2',
        session_id: 's-001',
        question_id: 'q-s001-2',
        user_id: demoUserId1,
        technical_accuracy_score: 85,
        relevance_score: 88,
        communication_score: 82,
        completeness_score: 80,
        problem_solving_score: 84,
        weighted_total_score: 84.3,
        answer_quality_analysis: 'Clear differentiation between optimistic and pessimistic strategies. Appropriate mention of Redis Redlock for distributed scenarios.',
        model_answer_suggestion: 'Discuss database transaction isolation levels (Repeatable Read vs Serializable) and fencing tokens to prevent split-brain in distributed locks.',
        missing_concepts: ['Transaction isolation levels', 'Fencing tokens in Redis Redlock'],
        strengths: ['Accurate SQL query representation', 'Good understanding of retry loops'],
        weaknesses: ['Omitted isolation levels and deadlock handling'],
        improvement_recommendations: ['Practice explaining isolation anomalies (dirty reads, phantom reads).'],
        is_ai_generated_estimate: true,
      },
    ],
    skill_analytics: [
      {
        id: 'sk-1',
        user_id: demoUserId1,
        skill_category: 'Technical Accuracy',
        proficiency_score: 85.0,
        interviews_tested: 5,
        strongest_point: 'Strong grasp of React reconciliation and state management',
        weakest_point: 'Edge cases in distributed transaction rollbacks',
        last_updated: new Date().toISOString(),
      },
      {
        id: 'sk-2',
        user_id: demoUserId1,
        skill_category: 'Relevance',
        proficiency_score: 88.0,
        interviews_tested: 5,
        strongest_point: 'Consistently addresses core requirements directly',
        weakest_point: 'Could tighten introductions before elaborating',
        last_updated: new Date().toISOString(),
      },
      {
        id: 'sk-3',
        user_id: demoUserId1,
        skill_category: 'Communication',
        proficiency_score: 81.0,
        interviews_tested: 5,
        strongest_point: 'Clear articulation of architectural tradeoffs',
        weakest_point: 'Pacing can accelerate when explaining complex algorithms',
        last_updated: new Date().toISOString(),
      },
      {
        id: 'sk-4',
        user_id: demoUserId1,
        skill_category: 'Completeness',
        proficiency_score: 78.0,
        interviews_tested: 5,
        strongest_point: 'Covers happy paths and baseline configurations well',
        weakest_point: 'Occasionally skips failure modes and latency mitigation',
        last_updated: new Date().toISOString(),
      },
      {
        id: 'sk-5',
        user_id: demoUserId1,
        skill_category: 'Problem-Solving Approach',
        proficiency_score: 83.5,
        interviews_tested: 5,
        strongest_point: 'Step-by-step breakdown using first principles',
        weakest_point: 'Can state computational complexity earlier in answers',
        last_updated: new Date().toISOString(),
      },
    ],
    learning_recommendations: [
      {
        id: 'rec-1',
        user_id: demoUserId1,
        topic: 'Database Sharding & Consistent Hashing',
        category: 'System Design',
        difficulty: 'Hard',
        description: 'Deep dive into horizontal partitioning strategies, hot key mitigations, and virtual node rings in distributed datastores.',
        resource_url: 'https://github.com/donnemartin/system-design-primer#consistent-hashing',
        is_completed: false,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'rec-2',
        user_id: demoUserId1,
        topic: 'STAR Method Behavioral Framing',
        category: 'Communication Exercise',
        difficulty: 'Medium',
        description: 'Practice formulating project conflict and deadline stories using Situation, Task, Action, and quantifiable Results.',
        resource_url: 'https://hbr.org/2021/02/how-to-answer-behavioral-interview-questions',
        is_completed: true,
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'rec-3',
        user_id: demoUserId1,
        topic: 'React Concurrent Rendering & useTransition',
        category: 'Technical Revision',
        difficulty: 'Medium',
        description: 'Explore how React 18 interrupts low-priority re-renders to maintain input responsiveness and avoid UI freezes.',
        resource_url: 'https://react.dev/reference/react/useTransition',
        is_completed: false,
        created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        id: 'rec-4',
        user_id: demoUserId1,
        topic: 'LRU Cache Implementation & Complexity Analysis',
        category: 'Coding Practice',
        difficulty: 'Medium',
        description: 'Implement an O(1) Get and Put cache using doubly-linked list with hash map lookup.',
        resource_url: 'https://leetcode.com/problems/lru-cache/',
        is_completed: false,
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
    ],
    user_badges: [
      {
        id: 'b-1',
        user_id: demoUserId1,
        badge_key: 'first_interview',
        title: 'First Step',
        description: 'Completed your very first AI mock interview session!',
        icon: 'Award',
        unlocked_at: new Date(Date.now() - 18 * 86400000).toISOString(),
      },
      {
        id: 'b-2',
        user_id: demoUserId1,
        badge_key: 'high_scorer',
        title: 'Top Performer',
        description: 'Scored above 85% on a challenging Technical Interview.',
        icon: 'Flame',
        unlocked_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        id: 'b-3',
        user_id: demoUserId1,
        badge_key: 'streak_3',
        title: 'Consistency Master',
        description: 'Practiced interviews 3 days in a row.',
        icon: 'Zap',
        unlocked_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'b-4',
        user_id: demoUserId1,
        badge_key: 'tech_guru',
        title: 'Technical Guru',
        description: 'Averaged 85%+ across Technical Accuracy evaluations.',
        icon: 'Cpu',
        unlocked_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ],
  };
}

class PersistentDb {
  private inMemoryCache: DatabaseSchema | null = null;

  private ensureDb(): DatabaseSchema {
    if (this.inMemoryCache) {
      return this.inMemoryCache;
    }

    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.inMemoryCache = JSON.parse(raw);
        return this.inMemoryCache!;
      }
    } catch (err) {
      console.warn('Error reading db file, falling back to initialized memory state:', err);
    }

    const initial = getInitialDbState();
    this.inMemoryCache = initial;
    this.persist();
    return initial;
  }

  private persist(): void {
    if (!this.inMemoryCache) return;
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.inMemoryCache, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- Users & Profiles ---
  async getUser(idOrEmail: string): Promise<User | null> {
    const db = this.ensureDb();
    return db.users.find((u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase()) || null;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const db = this.ensureDb();
    const newUser: User = {
      id: userData.id || `u-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: userData.email || '',
      full_name: userData.full_name || 'Anonymous Candidate',
      avatar_url: userData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: userData.role || 'student',
      created_at: new Date().toISOString(),
    };
    db.users.push(newUser);

    // Also create initial profile
    const profile: UserProfile = {
      id: `p-${newUser.id}`,
      user_id: newUser.id,
      target_role: 'Software Developer',
      experience_level: 'Intermediate',
      target_companies: ['Google', 'Microsoft', 'Amazon'],
      bio: 'Ready to ace technical and behavioral interviews.',
      skills: ['Problem Solving', 'Data Structures', 'Web Development'],
      preferred_language: 'English',
      theme_preference: 'light',
      total_interviews_completed: 0,
      average_score: 0,
    };
    db.user_profiles.push(profile);

    this.persist();
    return newUser;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const db = this.ensureDb();
    return db.user_profiles.find((p) => p.user_id === userId) || null;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const db = this.ensureDb();
    const idx = db.user_profiles.findIndex((p) => p.user_id === userId);
    if (idx === -1) {
      const newProfile: UserProfile = {
        id: `p-${userId}`,
        user_id: userId,
        target_role: updates.target_role || 'Software Developer',
        experience_level: updates.experience_level || 'Intermediate',
        target_companies: updates.target_companies || ['Google', 'Meta'],
        bio: updates.bio || '',
        skills: updates.skills || ['JavaScript'],
        preferred_language: updates.preferred_language || 'English',
        theme_preference: updates.theme_preference || 'light',
        total_interviews_completed: updates.total_interviews_completed || 0,
        average_score: updates.average_score || 0,
        ...updates,
      };
      db.user_profiles.push(newProfile);
      this.persist();
      return newProfile;
    }
    db.user_profiles[idx] = { ...db.user_profiles[idx], ...updates };
    this.persist();
    return db.user_profiles[idx];
  }

  // --- Sessions & Questions ---
  async createInterviewSession(session: Partial<InterviewSession>, questions: Partial<InterviewQuestion>[]): Promise<InterviewSession> {
    const db = this.ensureDb();
    const sessionId = session.id || `s-${Date.now()}`;
    const newSession: InterviewSession = {
      id: sessionId,
      user_id: session.user_id!,
      title: session.title || `${session.job_role} ${session.interview_type} Mock Interview`,
      job_role: session.job_role || 'Software Developer',
      experience_level: session.experience_level || 'Intermediate',
      interview_type: session.interview_type || 'Technical',
      difficulty: session.difficulty || 'Medium',
      question_count: questions.length || session.question_count || 5,
      duration_minutes: session.duration_minutes || 20,
      time_taken_seconds: 0,
      status: 'in_progress',
      resume_context: session.resume_context,
      created_at: new Date().toISOString(),
    };

    db.interview_sessions.unshift(newSession);

    // Add questions
    const createdQuestions: InterviewQuestion[] = questions.map((q, idx) => ({
      id: q.id || `q-${sessionId}-${idx + 1}`,
      session_id: sessionId,
      question_number: idx + 1,
      category: q.category || 'General',
      question_text: q.question_text || '',
      expected_concepts: q.expected_concepts || [],
      difficulty: q.difficulty || newSession.difficulty,
      is_followup: q.is_followup || false,
      parent_question_id: q.parent_question_id,
      created_at: new Date().toISOString(),
    }));

    db.interview_questions.push(...createdQuestions);
    this.persist();

    return { ...newSession, questions: createdQuestions };
  }

  async getInterviewSession(sessionId: string): Promise<InterviewSession | null> {
    const db = this.ensureDb();
    const session = db.interview_sessions.find((s) => s.id === sessionId);
    if (!session) return null;

    const questions = db.interview_questions.filter((q) => q.session_id === sessionId);
    const answers = db.interview_answers.filter((a) => a.session_id === sessionId);
    const evaluations = db.evaluation_results.filter((e) => e.session_id === sessionId);

    const questionsWithDetails = questions.map((q) => ({
      ...q,
      answer: answers.find((a) => a.question_id === q.id),
      evaluation: evaluations.find((e) => e.question_id === q.id),
    }));

    return {
      ...session,
      questions: questionsWithDetails,
    };
  }

  async listUserSessions(userId: string): Promise<InterviewSession[]> {
    const db = this.ensureDb();
    return db.interview_sessions
      .filter((s) => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async addFollowupQuestion(sessionId: string, parentQuestionId: string, questionText: string, expectedConcepts: string[] = []): Promise<InterviewQuestion> {
    const db = this.ensureDb();
    const existingCount = db.interview_questions.filter((q) => q.session_id === sessionId).length;
    const followup: InterviewQuestion = {
      id: `q-${sessionId}-f${Date.now()}`,
      session_id: sessionId,
      question_number: existingCount + 1,
      category: 'AI Follow-up Question',
      question_text: questionText,
      expected_concepts: expectedConcepts,
      difficulty: 'Medium',
      is_followup: true,
      parent_question_id: parentQuestionId,
      created_at: new Date().toISOString(),
    };
    db.interview_questions.push(followup);
    this.persist();
    return followup;
  }

  async saveInterviewAnswer(answer: Partial<InterviewAnswer>): Promise<InterviewAnswer> {
    const db = this.ensureDb();
    const existingIdx = db.interview_answers.findIndex(
      (a) => a.session_id === answer.session_id && a.question_id === answer.question_id
    );

    const newAnswer: InterviewAnswer = {
      id: answer.id || `ans-${Date.now()}`,
      session_id: answer.session_id!,
      question_id: answer.question_id!,
      user_id: answer.user_id!,
      answer_text: answer.answer_text || '',
      input_method: answer.input_method || 'text',
      time_spent_seconds: answer.time_spent_seconds || 0,
      created_at: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      db.interview_answers[existingIdx] = newAnswer;
    } else {
      db.interview_answers.push(newAnswer);
    }
    this.persist();
    return newAnswer;
  }

  async saveEvaluationResult(evalData: QuestionEvaluation): Promise<QuestionEvaluation> {
    const db = this.ensureDb();
    const existingIdx = db.evaluation_results.findIndex(
      (e) => e.session_id === evalData.session_id && e.question_id === evalData.question_id
    );

    const item: QuestionEvaluation = {
      id: evalData.id || `eval-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...evalData,
    };

    if (existingIdx !== -1) {
      db.evaluation_results[existingIdx] = item;
    } else {
      db.evaluation_results.push(item);
    }
    this.persist();
    return item;
  }

  async completeInterviewSession(
    sessionId: string,
    overallScore: number,
    performanceStatus: 'Exceptional' | 'Strong' | 'Satisfactory' | 'Needs Improvement',
    timeTakenSeconds: number
  ): Promise<InterviewSession | null> {
    const db = this.ensureDb();
    const session = db.interview_sessions.find((s) => s.id === sessionId);
    if (!session) return null;

    session.status = 'completed';
    session.overall_score = overallScore;
    session.performance_status = performanceStatus;
    session.time_taken_seconds = timeTakenSeconds;
    session.completed_at = new Date().toISOString();

    // Update user profile statistics
    const userProfile = db.user_profiles.find((p) => p.user_id === session.user_id);
    if (userProfile) {
      const userCompleted = db.interview_sessions.filter((s) => s.user_id === session.user_id && s.status === 'completed');
      userProfile.total_interviews_completed = userCompleted.length;
      const totalScore = userCompleted.reduce((acc, curr) => acc + (curr.overall_score || 0), 0);
      userProfile.average_score = Number((totalScore / userCompleted.length).toFixed(1));
    }

    // Check badges
    this.checkAndAwardBadges(session.user_id, overallScore);

    this.persist();
    return session;
  }

  private checkAndAwardBadges(userId: string, latestScore: number): void {
    const db = this.ensureDb();
    const userSessions = db.interview_sessions.filter((s) => s.user_id === userId && s.status === 'completed');

    const awardIfNotPresent = (badgeKey: string, title: string, description: string, icon: string) => {
      const exists = db.user_badges.some((b) => b.user_id === userId && b.badge_key === badgeKey);
      if (!exists) {
        db.user_badges.push({
          id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          user_id: userId,
          badge_key: badgeKey,
          title,
          description,
          icon,
          unlocked_at: new Date().toISOString(),
        });
      }
    };

    if (userSessions.length >= 1) {
      awardIfNotPresent('first_interview', 'First Step', 'Completed your very first AI mock interview session!', 'Award');
    }
    if (latestScore >= 85) {
      awardIfNotPresent('high_scorer', 'Top Performer', 'Scored above 85% on a challenging Interview session.', 'Flame');
    }
    if (userSessions.length >= 3) {
      awardIfNotPresent('streak_3', 'Consistency Master', 'Completed at least 3 mock interviews.', 'Zap');
    }
    if (userSessions.length >= 5) {
      awardIfNotPresent('veteran', 'Interview Veteran', 'Completed 5+ full-length AI mock interviews.', 'ShieldCheck');
    }
  }

  // --- Skill Analytics & Recommendations ---
  async getUserSkillAnalytics(userId: string): Promise<SkillAnalytics[]> {
    const db = this.ensureDb();
    const records = db.skill_analytics.filter((s) => s.user_id === userId);
    if (records.length > 0) return records;

    // Default set
    return [
      { id: 'sk-def-1', user_id: userId, skill_category: 'Technical Accuracy', proficiency_score: 75, interviews_tested: 0, strongest_point: 'Ready to assess', weakest_point: 'Ready to assess', last_updated: new Date().toISOString() },
      { id: 'sk-def-2', user_id: userId, skill_category: 'Relevance', proficiency_score: 75, interviews_tested: 0, strongest_point: 'Ready to assess', weakest_point: 'Ready to assess', last_updated: new Date().toISOString() },
      { id: 'sk-def-3', user_id: userId, skill_category: 'Communication', proficiency_score: 75, interviews_tested: 0, strongest_point: 'Ready to assess', weakest_point: 'Ready to assess', last_updated: new Date().toISOString() },
      { id: 'sk-def-4', user_id: userId, skill_category: 'Completeness', proficiency_score: 70, interviews_tested: 0, strongest_point: 'Ready to assess', weakest_point: 'Ready to assess', last_updated: new Date().toISOString() },
      { id: 'sk-def-5', user_id: userId, skill_category: 'Problem-Solving Approach', proficiency_score: 75, interviews_tested: 0, strongest_point: 'Ready to assess', weakest_point: 'Ready to assess', last_updated: new Date().toISOString() },
    ];
  }

  async updateSkillAnalytics(userId: string, metrics: { technical: number; relevance: number; communication: number; completeness: number; problemSolving: number }): Promise<void> {
    const db = this.ensureDb();
    const categories: [string, number][] = [
      ['Technical Accuracy', metrics.technical],
      ['Relevance', metrics.relevance],
      ['Communication', metrics.communication],
      ['Completeness', metrics.completeness],
      ['Problem-Solving Approach', metrics.problemSolving],
    ];

    for (const [cat, score] of categories) {
      const existing = db.skill_analytics.find((s) => s.user_id === userId && s.skill_category === cat);
      if (existing) {
        existing.proficiency_score = Number(((existing.proficiency_score * existing.interviews_tested + score) / (existing.interviews_tested + 1)).toFixed(1));
        existing.interviews_tested += 1;
        existing.last_updated = new Date().toISOString();
      } else {
        db.skill_analytics.push({
          id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          user_id: userId,
          skill_category: cat,
          proficiency_score: Number(score.toFixed(1)),
          interviews_tested: 1,
          strongest_point: 'Evaluated in recent session',
          weakest_point: 'Keep practicing',
          last_updated: new Date().toISOString(),
        });
      }
    }
    this.persist();
  }

  async getUserRecommendations(userId: string): Promise<LearningRecommendation[]> {
    const db = this.ensureDb();
    return db.learning_recommendations.filter((r) => r.user_id === userId);
  }

  async addLearningRecommendations(userId: string, sessionId: string, recs: Partial<LearningRecommendation>[]): Promise<void> {
    const db = this.ensureDb();
    for (const r of recs) {
      db.learning_recommendations.unshift({
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        session_id: sessionId,
        topic: r.topic || 'Core Concept Revision',
        category: r.category || 'Technical Revision',
        difficulty: r.difficulty || 'Medium',
        description: r.description || '',
        resource_url: r.resource_url || 'https://developer.mozilla.org',
        is_completed: false,
        created_at: new Date().toISOString(),
      });
    }
    this.persist();
  }

  async toggleRecommendationStatus(recId: string): Promise<boolean> {
    const db = this.ensureDb();
    const rec = db.learning_recommendations.find((r) => r.id === recId);
    if (!rec) return false;
    rec.is_completed = !rec.is_completed;
    this.persist();
    return rec.is_completed;
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const db = this.ensureDb();
    return db.user_badges.filter((b) => b.user_id === userId);
  }
}

export const db = new PersistentDb();
