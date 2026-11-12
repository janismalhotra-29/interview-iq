'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getCached, setCached, DEFAULT_DEMO_ANALYTICS } from '@/lib/client-cache';
import {
  Award,
  Flame,
  Zap,
  Cpu,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { UserBadge } from '@/types';

const ALL_SYSTEM_BADGES = [
  {
    key: 'first_interview',
    title: 'First Step',
    description: 'Completed your very first AI mock interview session.',
    icon: Award,
    category: 'Milestone',
  },
  {
    key: 'high_scorer',
    title: 'Top Performer',
    description: 'Scored above 85% on a challenging Technical or System Design Interview.',
    icon: Flame,
    category: 'Performance',
  },
  {
    key: 'streak_3',
    title: 'Consistency Master',
    description: 'Completed at least 3 full mock interviews.',
    icon: Zap,
    category: 'Habit',
  },
  {
    key: 'tech_guru',
    title: 'Technical Guru',
    description: 'Averaged 85%+ across Technical Accuracy evaluations.',
    icon: Cpu,
    category: 'Mastery',
  },
  {
    key: 'veteran',
    title: 'Interview Veteran',
    description: 'Completed 5+ full-length AI mock interviews.',
    icon: ShieldCheck,
    category: 'Milestone',
  },
  {
    key: 'speedster',
    title: 'Agile Articulator',
    description: 'Answered technical questions with concise, well-structured arguments.',
    icon: Trophy,
    category: 'Communication',
  },
];

export default function BadgesPage() {
  const { user } = useAuth();
  const [unlockedBadges, setUnlockedBadges] = useState<UserBadge[]>(() => {
    const cached = getCached<any>(`analytics_${user?.id}`);
    return cached?.badges || DEFAULT_DEMO_ANALYTICS.badges;
  });

  useEffect(() => {
    if (!user) return;
    const cached = getCached<any>(`analytics_${user.id}`);
    if (cached?.badges) {
      setUnlockedBadges(cached.badges);
    }
    const fetchBadges = async () => {
      try {
        const res = await fetch(`/api/analytics?userId=${user.id}`);
        if (res.ok) {
          const json = await res.json();
          const items = json.badges || [];
          setUnlockedBadges(items);
          setCached(`analytics_${user.id}`, json);
        }
      } catch (err) {
        console.error('Error fetching badges:', err);
      }
    };
    fetchBadges();
  }, [user]);

  const unlockedKeys = new Set(unlockedBadges.map((b) => b.badge_key));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--rule)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent)]/20 mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Gamified Milestones</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[var(--text)] tracking-tight">
            Progress Badges &amp; <em>Achievements</em>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-xl">
            Earn engineering distinctions as you practice, eliminate gaps, and elevate your interview scoring.
          </p>
        </div>

        <Link href="/interview/setup" className="btn-enfold inline-flex items-center gap-2 self-start sm:self-auto">
          <PlayCircle className="w-4 h-4" />
          <span>Earn Next Badge</span>
        </Link>
      </div>

      {/* Summary Box - Calm Tactile Paper Style */}
      <div className="paper p-6 sm:p-7 rounded-2xl flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-editorial text-xl text-[var(--text)] font-medium">
            Your Achievement Trophy Shelf
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {unlockedBadges.length} of {ALL_SYSTEM_BADGES.length} distinctions unlocked
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-editorial text-3xl font-semibold text-[var(--accent)] px-4 py-1.5 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)]/20">
            {unlockedBadges.length}/{ALL_SYSTEM_BADGES.length}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {ALL_SYSTEM_BADGES.map((b) => {
          const isUnlocked = unlockedKeys.has(b.key);
          const Icon = b.icon;

          return (
            <div
              key={b.key}
              className={`paper p-5 sm:p-6 rounded-2xl transition-all space-y-4 flex flex-col justify-between ${
                isUnlocked
                  ? 'border-[var(--rule)] hover:border-[var(--accent)]/40 shadow-xs'
                  : 'border-dashed border-[var(--rule)] opacity-55'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20'
                        : 'bg-[var(--active-bg)] text-[var(--text-muted)] border border-[var(--rule)]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] bg-[var(--active-bg)] px-2 py-0.5 rounded-full border border-[var(--rule)]">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-editorial text-base text-[var(--text)] font-medium">
                    {b.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--rule)] text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                {b.category}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
