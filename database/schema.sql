-- ====================================================================
-- InterviewIQ: AI-Powered Interview Preparation & Evaluation System
-- Production PostgreSQL & Supabase Database Schema
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table (aligned with Supabase auth.users or standalone auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_role VARCHAR(100) DEFAULT 'Software Developer',
    experience_level VARCHAR(50) DEFAULT 'Intermediate',
    target_companies TEXT[] DEFAULT ARRAY['Google', 'Microsoft', 'Amazon', 'Meta'],
    bio TEXT,
    skills TEXT[] DEFAULT ARRAY['JavaScript', 'TypeScript', 'React', 'Node.js', 'System Design'],
    preferred_language VARCHAR(50) DEFAULT 'English',
    theme_preference VARCHAR(20) DEFAULT 'light',
    custom_gemini_key TEXT,
    custom_openai_key TEXT,
    total_interviews_completed INT DEFAULT 0,
    average_score NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_profile UNIQUE(user_id)
);

-- 4. Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    job_role VARCHAR(100) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    interview_type VARCHAR(50) NOT NULL, -- 'Technical', 'HR', 'Behavioral', 'Mixed', 'System Design'
    difficulty VARCHAR(50) NOT NULL,    -- 'Easy', 'Medium', 'Hard', 'FAANG'
    question_count INT NOT NULL DEFAULT 5,
    duration_minutes INT NOT NULL DEFAULT 20,
    time_taken_seconds INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
    overall_score NUMERIC(5, 2) DEFAULT NULL,
    performance_status VARCHAR(50) DEFAULT NULL, -- 'Exceptional', 'Strong', 'Satisfactory', 'Needs Improvement'
    resume_context TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 5. Interview Questions Table
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Data Structures', 'System Design', 'Behavioral', 'Frameworks'
    question_text TEXT NOT NULL,
    expected_concepts TEXT[] DEFAULT ARRAY[]::TEXT[],
    difficulty VARCHAR(50) NOT NULL,
    is_followup BOOLEAN DEFAULT FALSE,
    parent_question_id UUID REFERENCES interview_questions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Interview Answers Table
CREATE TABLE IF NOT EXISTS interview_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    input_method VARCHAR(20) DEFAULT 'text', -- 'text' or 'voice'
    time_spent_seconds INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Evaluation Results Table
-- Strictly implements the 5 weighted parameters:
-- 1. Technical Accuracy (30%)
-- 2. Relevance (25%)
-- 3. Communication (20%)
-- 4. Completeness (15%)
-- 5. Problem-Solving Approach (10%)
CREATE TABLE IF NOT EXISTS evaluation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    technical_accuracy_score NUMERIC(5, 2) NOT NULL, -- out of 100
    relevance_score NUMERIC(5, 2) NOT NULL,          -- out of 100
    communication_score NUMERIC(5, 2) NOT NULL,      -- out of 100
    completeness_score NUMERIC(5, 2) NOT NULL,       -- out of 100
    problem_solving_score NUMERIC(5, 2) NOT NULL,    -- out of 100
    weighted_total_score NUMERIC(5, 2) NOT NULL,     -- calculated 30/25/20/15/10
    answer_quality_analysis TEXT NOT NULL,
    model_answer_suggestion TEXT NOT NULL,
    missing_concepts TEXT[] DEFAULT ARRAY[]::TEXT[],
    strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
    weaknesses TEXT[] DEFAULT ARRAY[]::TEXT[],
    improvement_recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_ai_generated_estimate BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Skill Analytics Table
CREATE TABLE IF NOT EXISTS skill_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_category VARCHAR(100) NOT NULL, -- e.g. 'Data Structures', 'System Design', 'Communication', 'React', 'Problem Solving'
    proficiency_score NUMERIC(5, 2) NOT NULL, -- 0 to 100
    interviews_tested INT DEFAULT 1,
    strongest_point TEXT,
    weakest_point TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_skill UNIQUE(user_id, skill_category)
);

-- 9. Learning Recommendations Table
CREATE TABLE IF NOT EXISTS learning_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES interview_sessions(id) ON DELETE SET NULL,
    topic VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Technical Revision', 'Coding Practice', 'System Design', 'Communication Exercise'
    difficulty VARCHAR(50) DEFAULT 'Medium',
    description TEXT NOT NULL,
    resource_url TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Achievements & Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_key VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_badge UNIQUE(user_id, badge_key)
);

-- ====================================================================
-- Indexes for High Performance Queries
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON interview_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_session_id ON interview_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON interview_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_session_id ON evaluation_results(session_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_user_id ON evaluation_results(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skill_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON learning_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON user_badges(user_id);

-- ====================================================================
-- Supabase Row Level Security (RLS) Policies
-- Ensures users only have access to their own data
-- ====================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can view and edit own profile" 
    ON users FOR ALL 
    USING (auth.uid() = id);

CREATE POLICY "Users can manage own user_profiles" 
    ON user_profiles FOR ALL 
    USING (auth.uid() = user_id);

-- Interview Sessions Policies
CREATE POLICY "Users can view and manage own sessions" 
    ON interview_sessions FOR ALL 
    USING (auth.uid() = user_id);

-- Interview Questions Policies (Accessible if user owns session)
CREATE POLICY "Users can access questions for own sessions" 
    ON interview_questions FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM interview_sessions 
            WHERE interview_sessions.id = interview_questions.session_id 
            AND interview_sessions.user_id = auth.uid()
        )
    );

-- Interview Answers Policies
CREATE POLICY "Users can manage own answers" 
    ON interview_answers FOR ALL 
    USING (auth.uid() = user_id);

-- Evaluation Results Policies
CREATE POLICY "Users can view own evaluations" 
    ON evaluation_results FOR ALL 
    USING (auth.uid() = user_id);

-- Skill Analytics Policies
CREATE POLICY "Users can view and manage own skill analytics" 
    ON skill_analytics FOR ALL 
    USING (auth.uid() = user_id);

-- Learning Recommendations Policies
CREATE POLICY "Users can view and update own recommendations" 
    ON learning_recommendations FOR ALL 
    USING (auth.uid() = user_id);

-- Badges Policies
CREATE POLICY "Users can view own badges" 
    ON user_badges FOR ALL 
    USING (auth.uid() = user_id);
