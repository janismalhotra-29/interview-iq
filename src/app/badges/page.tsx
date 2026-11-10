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
  Star,
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
  // Instant render from cache: 0ms latency
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Gamified Milestones</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Progress Badges & Achievements
          </h1>
          <p className="text-sm text-navy-500 dark:text-navy-400">
            Earn engineering distinctions as you practice, eliminate gaps, and elevate your interview scoring.
          </p>
        </div>

        <Link
          href="/interview/setup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all self-start sm:self-center"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Earn Next Badge</span>
        </Link>
      </div>

      {/* Summary Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-royal-600 to-violet-600 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Your Achievement Trophy Shelf</h2>
          <p className="text-xs text-brand-100">
            {unlockedBadges.length} of {ALL_SYSTEM_BADGES.length} badges unlocked
          </p>
        </div>
        <div className="text-3xl font-black bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl">
          {unlockedBadges.length}/{ALL_SYSTEM_BADGES.length}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ALL_SYSTEM_BADGES.map((b) => {
          const isUnlocked = unlockedKeys.has(b.key);
          const Icon = b.icon;

          return (
            <div
              key={b.key}
              className={`p-6 rounded-3xl border transition-all space-y-4 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white dark:bg-navy-850 border-brand-200 dark:border-brand-800 shadow-sm hover:shadow-md'
                  : 'bg-navy-50/50 dark:bg-navy-900/30 border-dashed border-navy-200 dark:border-navy-800 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-brand-600 to-royal-600 text-white shadow-md shadow-brand-500/20'
                        : 'bg-navy-200 dark:bg-navy-800 text-navy-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy-400 bg-navy-100 dark:bg-navy-800 px-2.5 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-navy-900 dark:text-white">
                    {b.title}
                  </h3>
                  <p className="text-xs text-navy-500 dark:text-navy-400 mt-1 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-navy-100 dark:border-navy-800 text-[10px] uppercase font-bold text-navy-400">
                {b.category}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
