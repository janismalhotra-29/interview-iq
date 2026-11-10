-- ====================================================================
-- InterviewIQ: Seed Data for Demo Accounts, Questions & Analytics
-- ====================================================================

-- 1. Demo User
INSERT INTO users (id, email, password_hash, full_name, avatar_url, role)
VALUES 
    ('d0000000-0000-0000-0000-000000000001', 'alex.morgan@example.com', 'demo_hash_alex', 'Alex Morgan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'student'),
    ('d0000000-0000-0000-0000-000000000002', 'priya.sharma@example.com', 'demo_hash_priya', 'Priya Sharma', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'student')
ON CONFLICT (email) DO NOTHING;

-- 2. Demo User Profiles
INSERT INTO user_profiles (user_id, target_role, experience_level, target_companies, bio, skills, total_interviews_completed, average_score)
VALUES 
    ('d0000000-0000-0000-0000-000000000001', 'Full Stack Developer', 'Intermediate', ARRAY['Google', 'Stripe', 'Vercel', 'Microsoft'], 'Passionate software developer focusing on modern web apps, distributed systems, and scalable React & Node architectures.', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design', 'Docker'], 6, 82.50),
    ('d0000000-0000-0000-0000-000000000002', 'AI/ML Engineer', 'Advanced', ARRAY['OpenAI', 'Anthropic', 'Google DeepMind'], 'Machine learning researcher and engineer experienced with Transformers, PyTorch, RAG systems, and model optimization.', ARRAY['Python', 'PyTorch', 'Transformers', 'FastAPI', 'MLOps', 'Vector Databases'], 4, 88.00)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Completed Interview Sessions for Demo
INSERT INTO interview_sessions (id, user_id, title, job_role, experience_level, interview_type, difficulty, question_count, duration_minutes, time_taken_seconds, status, overall_score, performance_status, created_at, completed_at)
VALUES 
    ('s0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Full Stack Architecture & React Deep Dive', 'Full Stack Developer', 'Intermediate', 'Technical', 'Hard', 5, 25, 1140, 'completed', 84.50, 'Strong', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '19 minutes'),
    ('s0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Frontend Engineering & Performance Optimization', 'Frontend Developer', 'Intermediate', 'Technical', 'Medium', 4, 20, 890, 'completed', 88.00, 'Exceptional', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '15 minutes'),
    ('s0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'Engineering Leadership & Cross-Functional Teamwork', 'Software Developer', 'Intermediate', 'HR', 'Medium', 4, 15, 720, 'completed', 79.00, 'Satisfactory', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '12 minutes'),
    ('s0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'Distributed Systems & Database Scaling', 'Backend Developer', 'Intermediate', 'Technical', 'Hard', 5, 25, 1280, 'completed', 76.50, 'Satisfactory', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days' + INTERVAL '21 minutes'),
    ('s0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000001', 'Modern JavaScript & Async Concurrency', 'Frontend Developer', 'Intermediate', 'Technical', 'Medium', 4, 20, 950, 'completed', 85.50, 'Strong', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days' + INTERVAL '16 minutes')
ON CONFLICT (id) DO NOTHING;

-- 4. Sample Skill Analytics
INSERT INTO skill_analytics (user_id, skill_category, proficiency_score, interviews_tested, strongest_point, weakest_point)
VALUES 
    ('d0000000-0000-0000-0000-000000000001', 'Technical Accuracy', 85.00, 5, 'Strong grasp of React reconciliation and state management', 'Edge cases in distributed transaction rollbacks'),
    ('d0000000-0000-0000-0000-000000000001', 'Relevance', 88.00, 5, 'Consistently stays focused on the question core', 'Could tighten introductions before elaborating'),
    ('d0000000-0000-0000-0000-000000000001', 'Communication', 81.00, 5, 'Clear articulation of architectural tradeoffs', 'Pacing can accelerate when explaining complex algorithms'),
    ('d0000000-0000-0000-0000-000000000001', 'Completeness', 78.00, 5, 'Covers happy paths and baseline configurations well', 'Occasionally skips failure modes and latency mitigation'),
    ('d0000000-0000-0000-0000-000000000001', 'Problem-Solving Approach', 83.50, 5, 'Step-by-step breakdown using first principles', 'Can state computational complexity earlier in answers')
ON CONFLICT (user_id, skill_category) DO NOTHING;

-- 5. Sample Learning Recommendations
INSERT INTO learning_recommendations (user_id, topic, category, difficulty, description, resource_url)
VALUES 
    ('d0000000-0000-0000-0000-000000000001', 'Database Sharding & Consistent Hashing', 'System Design', 'Hard', 'Deep dive into horizontal partitioning strategies, hot key mitigations, and virtual node rings in distributed datastores.', 'https://github.com/donnemartin/system-design-primer#consistent-hashing'),
    ('d0000000-0000-0000-0000-000000000001', 'STAR Method Behavioral Framing', 'Communication Exercise', 'Medium', 'Practice formulating project conflict and deadline stories using Situation, Task, Action, and quantifiable Results.', 'https://hbr.org/2021/02/how-to-answer-behavioral-interview-questions'),
    ('d0000000-0000-0000-0000-000000000001', 'React Concurrent Rendering & useTransition', 'Technical Revision', 'Medium', 'Explore how React 18 interrupts low-priority re-renders to maintain input responsiveness and avoid UI freezes.', 'https://react.dev/reference/react/useTransition'),
    ('d0000000-0000-0000-0000-000000000001', 'LRU Cache Implementation & Complexity Analysis', 'Coding Practice', 'Medium', 'Implement an O(1) Get and Put cache using doubly-linked list with hash map lookup.', 'https://leetcode.com/problems/lru-cache/')
ON CONFLICT DO NOTHING;

-- 6. Sample Badges
INSERT INTO user_badges (user_id, badge_key, title, description, icon)
VALUES 
    ('d0000000-0000-0000-0000-000000000001', 'first_interview', 'First Step', 'Completed your very first AI mock interview session!', 'Award'),
    ('d0000000-0000-0000-0000-000000000001', 'high_scorer', 'Top Performer', 'Scored above 85% on a challenging Technical Interview.', 'Flame'),
    ('d0000000-0000-0000-0000-000000000001', 'streak_3', 'Consistency Master', 'Practiced interviews 3 days in a row.', 'Zap'),
    ('d0000000-0000-0000-0000-000000000001', 'tech_guru', 'Technical Guru', 'Averaged 85%+ across Technical Accuracy evaluations.', 'Cpu')
ON CONFLICT (user_id, badge_key) DO NOTHING;
