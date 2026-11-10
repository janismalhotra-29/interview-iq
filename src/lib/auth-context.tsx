'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '@/types';
import { getCached, setCached, clearCached } from '@/lib/client-cache';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (email: string) => Promise<boolean>;
  register: (fullName: string, email: string, targetRole: string, experienceLevel: string) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (demoId: 'alex' | 'priya') => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const DEFAULT_DEMO_ALEX: User = {
  id: 'd0000000-0000-0000-0000-000000000001',
  email: 'alex.morgan@example.com',
  full_name: 'Alex Morgan',
  avatar_url: '',
  role: 'student',
};

const DEFAULT_PROFILE_ALEX: UserProfile = {
  id: 'p-1',
  user_id: DEFAULT_DEMO_ALEX.id,
  target_role: 'Full Stack Developer',
  experience_level: 'Intermediate',
  target_companies: ['Google', 'Stripe', 'Vercel', 'Microsoft'],
  bio: 'Passionate software developer focusing on modern web apps, distributed systems, and scalable React & Node architectures.',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design', 'Docker'],
  preferred_language: 'English',
  theme_preference: 'light',
  total_interviews_completed: 5,
  average_score: 82.7,
};

const DEFAULT_DEMO_PRIYA: User = {
  id: 'd0000000-0000-0000-0000-000000000002',
  email: 'priya.sharma@example.com',
  full_name: 'Priya Sharma',
  avatar_url: '',
  role: 'student',
};

const DEFAULT_PROFILE_PRIYA: UserProfile = {
  id: 'p-2',
  user_id: DEFAULT_DEMO_PRIYA.id,
  target_role: 'AI/ML Engineer',
  experience_level: 'Advanced',
  target_companies: ['OpenAI', 'Anthropic', 'Google DeepMind'],
  bio: 'Machine learning researcher and engineer experienced with Transformers, PyTorch, RAG systems, and model optimization.',
  skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'MLOps', 'Vector Databases'],
  preferred_language: 'English',
  theme_preference: 'light',
  total_interviews_completed: 4,
  average_score: 88.0,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Pre-seed with instant non-null user and profile so there is ZERO initial delay or blank screen
  const [user, setUser] = useState<User | null>(DEFAULT_DEMO_ALEX);
  const [profile, setProfile] = useState<UserProfile | null>(DEFAULT_PROFILE_ALEX);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load user and profile asynchronously in the background without blocking render
  const fetchUserData = async (userId: string) => {
    // Check local client cache first
    const cachedAuth = getCached<{ user: User; profile: UserProfile }>(`auth_${userId}`);
    if (cachedAuth) {
      setUser(cachedAuth.user);
      setProfile(cachedAuth.profile);
      if (cachedAuth.profile?.theme_preference) {
        setTheme(cachedAuth.profile.theme_preference);
        applyTheme(cachedAuth.profile.theme_preference);
      }
    }

    try {
      const res = await fetch(`/api/auth/me?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
        setCached(`auth_${userId}`, { user: data.user, profile: data.profile });
        if (data.profile?.theme_preference) {
          setTheme(data.profile.theme_preference);
          applyTheme(data.profile.theme_preference);
        }
      }
    } catch (err) {
      console.warn('Failed to load user profile, using fallback profile:', err);
    }
  };

  const applyTheme = (t: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (t === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    // Check saved user id or fallback to demo
    const savedId = typeof window !== 'undefined' ? localStorage.getItem('interviewiq_user_id') : null;
    const initialId = savedId || DEFAULT_DEMO_ALEX.id;
    
    // If Priya was saved, immediately mount Priya's initial state
    if (initialId === DEFAULT_DEMO_PRIYA.id) {
      setUser(DEFAULT_DEMO_PRIYA);
      setProfile(DEFAULT_PROFILE_PRIYA);
    }

    fetchUserData(initialId);

    const savedTheme = typeof window !== 'undefined' ? (localStorage.getItem('interviewiq_theme') as 'light' | 'dark') : null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('interviewiq_theme', next);
    }
    if (user) {
      updateProfile({ theme_preference: next });
    }
  };

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
        setCached(`auth_${data.user.id}`, { user: data.user, profile: data.profile });
        clearCached('analytics_');
        clearCached('interviews_');
        if (typeof window !== 'undefined') {
          localStorage.setItem('interviewiq_user_id', data.user.id);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (fullName: string, email: string, targetRole: string, experienceLevel: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          target_role: targetRole,
          experience_level: experienceLevel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
        setCached(`auth_${data.user.id}`, { user: data.user, profile: data.profile });
        clearCached('analytics_');
        clearCached('interviews_');
        if (typeof window !== 'undefined') {
          localStorage.setItem('interviewiq_user_id', data.user.id);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    clearCached();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('interviewiq_user_id');
    }
  };

  const switchDemoUser = async (demoKey: 'alex' | 'priya') => {
    const targetUser = demoKey === 'alex' ? DEFAULT_DEMO_ALEX : DEFAULT_DEMO_PRIYA;
    const targetProfile = demoKey === 'alex' ? DEFAULT_PROFILE_ALEX : DEFAULT_PROFILE_PRIYA;
    setUser(targetUser);
    setProfile(targetProfile);
    clearCached('analytics_');
    clearCached('interviews_');
    if (typeof window !== 'undefined') {
      localStorage.setItem('interviewiq_user_id', targetUser.id);
    }
    await fetchUserData(targetUser.id);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updates }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setCached(`auth_${user.id}`, { user, profile: data.profile });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Profile update error:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        switchDemoUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
