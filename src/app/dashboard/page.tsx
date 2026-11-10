'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getCached, setCached, DEFAULT_DEMO_ANALYTICS } from '@/lib/client-cache';
import RadarScoreChart from '@/components/RadarScoreChart';
import PerformanceChart from '@/components/PerformanceChart';
import {
  PlayCircle,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  BarChart2,
  BookOpen,
  ChevronRight,
  Flame,
  Target,
  Trophy,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [data, setData] = useState<any>(() => {
    return getCached(`analytics_${user?.id}`) || DEFAULT_DEMO_ANALYTICS;
  });

  useEffect(() => {
    if (!user) return;
    const cached = getCached(`analytics_${user.id}`);
    if (cached) {
      setData(cached);
    }
    const loadAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics?userId=${user.id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setCached(`analytics_${user.id}`, json);
        }
      } catch (err) {
        console.error('Failed to load dashboard analytics:', err);
      }
    };
    loadAnalytics();
  }, [user]);

  const stats = data?.stats || {
    totalInterviewsCompleted: 5,
    averageScore: 82.7,
    readinessPercentage: 87,
    strongestSkill: { name: 'Full Stack Architecture', score: 88, description: 'Virtual DOM, Fiber scheduling and concurrency' },
    areasForImprovement: { name: 'Distributed Consistency', score: 72, description: 'Saga patterns and distributed locks' },
  };

  const charts = data?.charts || { radarData: [], historyTrend: [] };
  const recentInterviews = data?.recentInterviews || [];
  const recommendations = data?.recommendations || [];
  const badges = data?.badges || [];

  const avg = stats.averageScore || 82;
  const companyReadiness = [
    {
      company: 'Google',
      matchScore: Math.min(95, Math.round(avg * 1.01)),
      status: 'High Match',
      strongDomain: 'Virtual DOM & Algorithm Diffing',
      gapDomain: 'Distributed rollback edge-cases',
      recommendedDifficulty: 'Hard',
    },
    {
      company: 'Amazon',
      matchScore: Math.min(96, Math.round(avg * 1.05)),
      status: 'Interview Ready',
      strongDomain: 'STAR Behavioral Leadership',
      gapDomain: 'High-throughput concurrency limits',
      recommendedDifficulty: 'Medium',
    },
    {
      company: 'Microsoft',
      matchScore: Math.min(94, Math.round(avg * 1.03)),
      status: 'Interview Ready',
      strongDomain: 'Data Structures & Synchronization',
      gapDomain: 'Microservices network latency',
      recommendedDifficulty: 'Medium',
    },
    {
      company: 'Stripe',
      matchScore: Math.min(92, Math.round(avg * 0.98)),
      status: 'Competitive',
      strongDomain: 'Optimistic vs Pessimistic Locking',
      gapDomain: 'Idempotency key consistency',
      recommendedDifficulty: 'Hard',
    },
  ];

  const currentStreak = 3;
  const xpPoints = 840;
  const maxLevelXp = 1000;
  const xpPercent = Math.round((xpPoints / maxLevelXp) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Header Command Strip (Enfold Tactile Paper) */}
      <div className="paper p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl font-semibold text-[var(--text)]">
              Welcome back, <em>{user?.full_name?.split(' ')[0] || 'Candidate'}.</em>
            </h1>
            <span className="text-[11px] font-mono text-[var(--text-muted)] border border-[var(--rule)] px-2 py-0.5 rounded-full">
              {profile?.target_role || 'Software Engineer'}
            </span>
          </div>
          <p className="text-xs text-[var(--text-soft)]">
            Readiness evaluated across {stats.totalInterviewsCompleted} mock sessions • Last session completed recently
          </p>
        </div>

        {/* Status Pills & Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-xs shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="font-medium text-[var(--text)] tabular-nums">{currentStreak} day streak</span>
          </div>

          {/* Level / XP */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-xs shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="text-[var(--text-soft)]">Level 4</span>
            <div className="w-16 h-1.5 rounded-full bg-[var(--rule)] overflow-hidden">
              <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${xpPercent}%` }} />
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] tabular-nums">{xpPercent}%</span>
          </div>

          {/* Primary Action Button */}
          <Link
            href="/interview/setup"
            className="btn-enfold py-1.5 px-4 text-xs"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>New mock</span>
          </Link>

          <Link
            href="/roadmap"
            className="btn-enfold-ghost py-1.5 px-4 text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 opacity-70" />
            <span>Roadmap</span>
          </Link>
        </div>
      </div>

      {/* 2. Target Company Placement Readiness Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Target hiring bar alignment</span>
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">Calibrated against candidate benchmarks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {companyReadiness.map((comp, idx) => (
            <div
              key={idx}
              className="paper p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--bg)] border border-[var(--rule)] flex items-center justify-center font-mono text-[10px] font-bold text-[var(--text)]">
                      {comp.company[0]}
                    </div>
                    <span className="font-editorial text-sm font-semibold text-[var(--text)]">{comp.company}</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text)] font-mono tabular-nums">
                    {comp.matchScore}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-[var(--rule)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full"
                    style={{ width: `${comp.matchScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--accent)] font-medium">
                    {comp.status}
                  </span>
                  <span className="text-[var(--text-muted)] font-mono text-[10px]">{comp.recommendedDifficulty}</span>
                </div>

                <div className="pt-1 space-y-1 text-[11px] text-[var(--text-soft)]">
                  <p className="line-clamp-1">
                    <span className="text-[var(--text)] font-medium">Strength:</span> {comp.strongDomain}
                  </p>
                  <p className="line-clamp-1">
                    <span className="text-[var(--text)] font-medium">Focus:</span> {comp.gapDomain}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--rule)]">
                <Link
                  href="/interview/setup"
                  className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--active-bg)] transition-colors"
                >
                  <span>Practice session</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="paper p-5">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-mono">Sessions completed</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-editorial text-3xl font-semibold text-[var(--text)] tabular-nums">
              {stats.totalInterviewsCompleted}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">sessions</span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">All data stored locally</p>
        </div>

        <div className="paper p-5">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-mono">Average score</span>
            <BarChart2 className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-editorial text-3xl font-semibold text-[var(--text)] tabular-nums">
              {stats.averageScore}%
            </span>
            <span className="text-[10px] font-mono text-[var(--accent)] font-semibold">
              {stats.averageScore >= 80 ? 'Tier 1' : 'Solid'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">5-metric weighted evaluation</p>
        </div>

        <div className="paper p-5">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-mono">Strongest area</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text)] truncate">
                {stats.strongestSkill.name}
              </span>
              <span className="text-xs font-mono font-medium text-[var(--text)] tabular-nums">
                {stats.strongestSkill.score}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)] line-clamp-1">{stats.strongestSkill.description}</p>
          </div>
        </div>

        <div className="paper p-5">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-mono">Target area</span>
            <AlertCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text)] truncate">
                {stats.areasForImprovement.name}
              </span>
              <span className="text-xs font-mono font-medium text-[var(--text)] tabular-nums">
                {stats.areasForImprovement.score}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)] line-clamp-1">{stats.areasForImprovement.description}</p>
          </div>
        </div>
      </div>

      {/* 4. Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="paper p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-sm font-semibold text-[var(--text)]">Performance trajectory</h2>
              <p className="text-[11px] text-[var(--text-muted)]">Scores across sequential mock sessions</p>
            </div>
            <Link href="/analytics" className="text-[11px] font-medium text-[var(--accent)] hover:underline flex items-center gap-1">
              <span>Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <PerformanceChart data={charts.historyTrend} />
        </div>

        <div className="paper p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-sm font-semibold text-[var(--text)]">Competency radar</h2>
              <p className="text-[11px] text-[var(--text-muted)]">Technical, Relevance, Comm, Completeness, Problem Solving</p>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Normalized 100pt</span>
          </div>
          <RadarScoreChart data={charts.radarData} />
        </div>
      </div>

      {/* 5. Recent Sessions & Study Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 paper p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-sm font-semibold text-[var(--text)]">Recent mock sessions</h2>
            <Link href="/history" className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1">
              <span>Archive</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[var(--rule)]">
            {recentInterviews.map((session: any) => (
              <div key={session.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-[var(--text)]">{session.title}</span>
                    <span className="text-[10px] font-mono px-1.5 rounded-full bg-[var(--bg)] border border-[var(--rule)] text-[var(--text-soft)]">
                      {session.difficulty}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 font-mono">
                    <span>{session.job_role}</span>
                    <span>•</span>
                    <span>{new Date(session.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-[var(--text)] tabular-nums">
                      {session.overall_score ? `${session.overall_score}%` : 'Pending'}
                    </div>
                  </div>
                  <Link
                    href={session.status === 'completed' ? `/report/${session.id}` : `/interview/${session.id}`}
                    className="btn-enfold-ghost py-1 px-3 text-[11px]"
                  >
                    {session.status === 'completed' ? 'Report' : 'Resume'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations & Badges */}
        <div className="paper p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-sm font-semibold text-[var(--text)]">Study recommendations</h2>
            <Link href="/roadmap" className="text-[11px] text-[var(--accent)] hover:underline">
              Full map
            </Link>
          </div>

          <div className="space-y-2.5">
            {recommendations.slice(0, 3).map((rec: any) => (
              <div key={rec.id} className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--rule)] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-[var(--text)]">{rec.topic}</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">{rec.difficulty}</span>
                </div>
                <p className="text-[11px] text-[var(--text-soft)] line-clamp-1">{rec.description}</p>
                {rec.resource_url && (
                  <a
                    href={rec.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline pt-0.5"
                  >
                    <span>Reference guide</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
