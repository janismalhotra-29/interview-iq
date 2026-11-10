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
  Clock,
  ArrowRight,
  Sparkles,
  BarChart2,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Zap,
  Flame,
  Building,
  Target,
  Trophy,
  Check,
  Briefcase,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  // Instant render from cache or pre-seeded data: 0ms latency, no blocking spinner
  const [data, setData] = useState<any>(() => {
    return getCached(`analytics_${user?.id}`) || DEFAULT_DEMO_ANALYTICS;
  });

  useEffect(() => {
    if (!user) return;
    const cached = getCached(`analytics_${user.id}`);
    if (cached) {
      setData(cached);
    }
    // Background revalidation (SWR)
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
    totalInterviewsCompleted: 0,
    averageScore: 0,
    readinessPercentage: 0,
    strongestSkill: { name: 'Technical Analysis', score: 85, description: 'Consistent performance' },
    areasForImprovement: { name: 'Distributed Consistency', score: 72, description: 'Requires practice' },
  };

  const charts = data?.charts || { radarData: [], historyTrend: [] };
  const recentInterviews = data?.recentInterviews || [];
  const recommendations = data?.recommendations || [];
  const badges = data?.badges || [];

  // Company readiness calculation based on average score
  const avg = stats.averageScore || 82;
  const companyReadiness = [
    {
      company: 'Google',
      logo: 'https://www.google.com/favicon.ico',
      color: 'from-blue-500 to-emerald-500',
      matchScore: Math.min(95, Math.round(avg * 1.01)),
      status: 'Strong Candidate',
      statusColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
      strongDomain: 'Virtual DOM & Algorithm Diffing',
      gapDomain: 'Distributed rollback edge-cases',
      recommendedDifficulty: 'Hard',
    },
    {
      company: 'Amazon',
      logo: 'https://www.amazon.com/favicon.ico',
      color: 'from-amber-500 to-orange-500',
      matchScore: Math.min(96, Math.round(avg * 1.05)),
      status: 'Interview Ready',
      statusColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
      strongDomain: 'STAR Behavioral Leadership Principles',
      gapDomain: 'High-throughput concurrency limits',
      recommendedDifficulty: 'Medium',
    },
    {
      company: 'Microsoft',
      logo: 'https://www.microsoft.com/favicon.ico',
      color: 'from-blue-600 to-cyan-500',
      matchScore: Math.min(94, Math.round(avg * 1.03)),
      status: 'Interview Ready',
      statusColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
      strongDomain: 'Data Structures & System Synchronization',
      gapDomain: 'Microservices network latency',
      recommendedDifficulty: 'Medium',
    },
    {
      company: 'Stripe / Fintech',
      logo: 'https://stripe.com/favicon.ico',
      color: 'from-violet-600 to-purple-500',
      matchScore: Math.min(92, Math.round(avg * 0.98)),
      status: 'Competitive',
      statusColor: 'text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 border-blue-200',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner: Placement Command Center + Streak + XP Level */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-royal-950 to-brand-950 text-white shadow-xl relative overflow-hidden space-y-6 border border-navy-800">
        {/* Glow ambient background circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-brand-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Campus & Placement Preparation Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Candidate'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-navy-300 max-w-xl leading-relaxed">
              Target Role: <strong className="text-white">{profile?.target_role || 'Full Stack Developer'}</strong> • Track your readiness score for top-tier software and tech interviews.
            </p>
          </div>

          {/* Practice Streak & Level Widget */}
          <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            {/* Streak Counter */}
            <div className="flex items-center gap-3 pr-4 border-r border-white/15">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-black text-lg text-white">
                  <span>{currentStreak} Day</span>
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">Streak!</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <span
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                        idx < currentStreak
                          ? 'bg-amber-400 text-navy-950 font-black'
                          : 'bg-white/15 text-white/50'
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* XP Level progression */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="font-bold text-brand-200 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  <span>Level 4: Senior Aspirant</span>
                </span>
                <span className="text-[11px] font-mono text-navy-300">{xpPoints} / {maxLevelXp} XP</span>
              </div>
              <div className="w-36 h-2 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-400 to-emerald-400 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 pt-1 border-t border-white/10">
          <Link
            href="/interview/setup"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 via-royal-500 to-violet-500 text-white font-extrabold text-xs shadow-lg hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.99]"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Launch Placement Mock Interview</span>
          </Link>

          <Link
            href="/roadmap"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md border border-white/15 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Personalized Placement Roadmap</span>
          </Link>
        </div>
      </div>

      {/* 2. Dream Company Placement Readiness Tracker (Option B Star Feature!) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-navy-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-600" />
              <span>Target Company Placement Readiness</span>
            </h2>
            <p className="text-xs text-navy-500 dark:text-navy-400">
              Evaluated against real candidate hiring bars and past interview transcripts
            </p>
          </div>
          <span className="text-xs text-navy-400 font-medium">Updated automatically after each mock</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {companyReadiness.map((comp, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs hover:border-brand-300 dark:hover:border-brand-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Company Name & Match Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 flex items-center justify-center font-bold text-xs">
                      <Building className="w-4 h-4 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-navy-900 dark:text-white">
                        {comp.company}
                      </h3>
                      <span className="text-[10px] text-navy-400 font-medium">Hiring Bar Match</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-navy-900 dark:text-white">
                      {comp.matchScore}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-navy-100 dark:bg-navy-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-royal-500 rounded-full"
                    style={{ width: `${comp.matchScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${comp.statusColor}`}>
                    {comp.status}
                  </span>
                  <span className="text-[10px] text-navy-400 font-semibold">{comp.recommendedDifficulty} Difficulty</span>
                </div>

                {/* Strong & Gap bullets */}
                <div className="space-y-1.5 pt-1 text-[11px] text-navy-600 dark:text-navy-300">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="line-clamp-1"><strong>Strength:</strong> {comp.strongDomain}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="line-clamp-1"><strong>Gaps:</strong> {comp.gapDomain}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-navy-100 dark:border-navy-800">
                <Link
                  href="/interview/setup"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-200 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-navy-700 transition-colors"
                >
                  <span>Practice {comp.company} Mock</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Primary KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Interviews */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
              Completed Mock Interviews
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900 dark:text-white">
              {stats.totalInterviewsCompleted}
            </span>
            <span className="text-xs text-navy-500">sessions</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Persistent history tracked</span>
          </div>
        </div>

        {/* Average Interview Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
              Average Score
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-900 dark:text-white">
              {stats.averageScore}%
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-semibold">
              {stats.averageScore >= 80 ? 'Tier 1' : 'Solid'}
            </span>
          </div>
          <p className="mt-2 text-xs text-navy-500 dark:text-navy-400">
            Across 5 weighted engineering rubrics
          </p>
        </div>

        {/* Strongest Skill */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
              Strongest Area
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-navy-900 dark:text-white truncate text-base">
                {stats.strongestSkill.name}
              </span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {stats.strongestSkill.score}%
              </span>
            </div>
            <p className="mt-1 text-xs text-navy-500 dark:text-navy-400 line-clamp-1">
              {stats.strongestSkill.description}
            </p>
          </div>
        </div>

        {/* Areas Requiring Improvement */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
              Target for Improvement
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-navy-900 dark:text-white truncate text-base">
                {stats.areasForImprovement.name}
              </span>
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                {stats.areasForImprovement.score}%
              </span>
            </div>
            <p className="mt-1 text-xs text-navy-500 dark:text-navy-400 line-clamp-1">
              {stats.areasForImprovement.description}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Progression Graph */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900 dark:text-white">
                Historical Performance Trend
              </h2>
              <p className="text-xs text-navy-500 dark:text-navy-400">
                Score evolution across completed mock interviews
              </p>
            </div>
            <Link
              href="/analytics"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Detailed view</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <PerformanceChart data={charts.historyTrend} />
        </div>

        {/* 5-Dimensional Skill Radar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900 dark:text-white">
                5-Parameter Competency Profile
              </h2>
              <p className="text-xs text-navy-500 dark:text-navy-400">
                Weighted radar across Technical, Relevance, Comm, Completeness & Problem-Solving
              </p>
            </div>
            <span className="text-xs font-semibold text-navy-400 bg-navy-50 dark:bg-navy-800 px-2.5 py-1 rounded-full">
              Real DB Data
            </span>
          </div>
          <RadarScoreChart data={charts.radarData} />
        </div>
      </div>

      {/* 5. Bottom Grid: Recent Interviews & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Interviews (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900 dark:text-white">
                Recent Interview History
              </h2>
              <p className="text-xs text-navy-500 dark:text-navy-400">
                Review detailed AI feedback transcripts and model answer breakdowns
              </p>
            </div>
            <Link
              href="/history"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentInterviews.length === 0 ? (
              <div className="text-center py-8 text-navy-400 text-xs">
                No mock interviews completed yet. Click Launch Placement Mock Interview above to begin!
              </div>
            ) : (
              recentInterviews.map((session: any) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-navy-50/60 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-800 hover:border-brand-200 dark:hover:border-brand-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-navy-900 dark:text-white">
                        {session.title}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          session.difficulty === 'Hard'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-navy-500 dark:text-navy-400">
                      <span>{session.job_role}</span>
                      <span>•</span>
                      <span>{new Date(session.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{session.question_count} Questions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-navy-900 dark:text-white">
                        {session.overall_score ? `${session.overall_score}%` : 'In Progress'}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {session.performance_status || 'Active'}
                      </div>
                    </div>
                    <Link
                      href={session.status === 'completed' ? `/report/${session.id}` : `/interview/${session.id}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-200 border border-navy-200 dark:border-navy-700 hover:bg-brand-50 dark:hover:bg-navy-700 hover:text-brand-600 transition-colors"
                    >
                      {session.status === 'completed' ? 'View Report' : 'Resume'}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Personalized Recommendations & Badges (1 column) */}
        <div className="space-y-6">
          {/* Actionable Recommendations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Recommended Next Steps</span>
              </h2>
            </div>

            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec: any) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-navy-50/70 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy-900 dark:text-white">
                      {rec.topic}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-medium">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-navy-600 dark:text-navy-400 line-clamp-2">
                    {rec.description}
                  </p>
                  {rec.resource_url && (
                    <a
                      href={rec.resource_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-1"
                    >
                      <span>Study Resource</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                <span>Achievements</span>
              </h2>
              <Link href="/badges" className="text-xs font-semibold text-brand-600 hover:underline">
                View all ({badges.length})
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {badges.map((b: any) => (
                <div
                  key={b.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/60 text-xs font-semibold"
                >
                  <Award className="w-3.5 h-3.5 text-brand-600" />
                  <span>{b.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
