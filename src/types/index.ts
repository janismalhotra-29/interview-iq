export type RoleType =
  | 'Software Developer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Data Scientist'
  | 'AI/ML Engineer'
  | 'Data Analyst'
  | 'DevOps / Cloud Engineer'
  | 'System Design Engineer'
  | 'Product Manager';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type InterviewType = 'Technical' | 'HR' | 'Behavioral' | 'Mixed' | 'System Design';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'FAANG' | string;

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  target_role: string;
  experience_level: ExperienceLevel;
  target_companies: string[];
  bio: string;
  skills: string[];
  preferred_language: string;
  theme_preference: 'light' | 'dark';
  custom_gemini_key?: string;
  custom_openai_key?: string;
  total_interviews_completed: number;
  average_score: number;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  title: string;
  job_role: RoleType | string;
  experience_level: ExperienceLevel;
  interview_type: InterviewType;
  difficulty: DifficultyLevel;
  question_count: number;
  duration_minutes: number;
  time_taken_seconds: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  overall_score?: number;
  performance_status?: 'Exceptional' | 'Strong' | 'Satisfactory' | 'Needs Improvement';
  resume_context?: string;
  created_at: string;
  completed_at?: string;
  questions?: InterviewQuestion[];
  evaluation?: SessionEvaluationSummary;
}

export interface InterviewQuestion {
  id: string;
  session_id: string;
  question_number: number;
  category: string;
  question_text: string;
  expected_concepts: string[];
  difficulty: DifficultyLevel;
  is_followup?: boolean;
  parent_question_id?: string;
  created_at?: string;
  answer?: InterviewAnswer;
  evaluation?: QuestionEvaluation;
}

export interface InterviewAnswer {
  id: string;
  session_id: string;
  question_id: string;
  user_id: string;
  answer_text: string;
  input_method: 'text' | 'voice';
  time_spent_seconds: number;
  created_at?: string;
}

export interface QuestionEvaluation {
  id?: string;
  session_id: string;
  question_id: string;
  user_id: string;
  technical_accuracy_score: number; // 30%
  relevance_score: number;          // 25%
  communication_score: number;      // 20%
  completeness_score: number;       // 15%
  problem_solving_score: number;    // 10%
  weighted_total_score: number;     // calculated
  answer_quality_analysis: string;
  model_answer_suggestion: string;
  missing_concepts: string[];
  strengths: string[];
  weaknesses: string[];
  improvement_recommendations: string[];
  is_ai_generated_estimate: boolean;
}

export interface SessionEvaluationSummary {
  overall_score: number;
  performance_status: 'Exceptional' | 'Strong' | 'Satisfactory' | 'Needs Improvement';
  technical_accuracy_avg: number;
  relevance_avg: number;
  communication_avg: number;
  completeness_avg: number;
  problem_solving_avg: number;
  total_questions_answered: number;
  key_strengths: string[];
  critical_areas_for_improvement: string[];
  general_feedback: string;
  disclaimer: string;
  question_evaluations: QuestionEvaluation[];
}

export interface SkillAnalytics {
  id: string;
  user_id: string;
  skill_category: string;
  proficiency_score: number;
  interviews_tested: number;
  strongest_point: string;
  weakest_point: string;
  last_updated: string;
}

export interface LearningRecommendation {
  id: string;
  user_id: string;
  session_id?: string;
  topic: string;
  category: 'Technical Revision' | 'Coding Practice' | 'System Design' | 'Communication Exercise';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  resource_url?: string;
  is_completed: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_key: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string;
}

export interface InterviewSetupConfig {
  job_role: RoleType;
  experience_level: ExperienceLevel;
  interview_type: InterviewType;
  difficulty: DifficultyLevel;
  question_count: number;
  duration_minutes: number;
  resume_text?: string;
  resume_filename?: string;
}
