'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getCached, setCached, DEFAULT_DEMO_ANALYTICS } from '@/lib/client-cache';
import RadarScoreChart from '@/components/RadarScoreChart';
import PerformanceChart from '@/components/PerformanceChart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(() => {
    return getCached(`analytics_${user?.id}`) || DEFAULT_DEMO_ANALYTICS;
  });

  useEffect(() => {
    if (!user) return;
    const cached = getCached(`analytics_${user.id}`);
    if (cached) {
      setData(cached);
    }
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics?userId=${user.id}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setCached(`analytics_${user.id}`, json);
        }
      } catch (err) {
        console.error('Error fetching analytics page:', err);
      }
    };
    fetchAnalytics();
  }, [user]);

  const stats = data?.stats || {
    totalInterviewsCompleted: 0,
    averageScore: 0,
    readinessPercentage: 0,
    strongestSkill: { name: 'Technical', score: 85 },
    areasForImprovement: { name: 'Communication', score: 75 },
  };

  const radarData = data?.charts?.radarData || [];
  const historyTrend = data?.charts?.historyTrend || [];

  const comparisonData = historyTrend.map((h: any) => ({
    name: h.title.length > 18 ? h.title.substring(0, 16) + '...' : h.title,
    score: h.score,
    date: h.date,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--rule)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent)]/20 mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Multi-Metric Performance Suite</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[var(--text)] tracking-tight">
            Performance &amp; <em>Skill Analytics</em>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-xl">
            Real longitudinal analysis across the 5 weighted academic evaluation parameters.
          </p>
        </div>

        <Link href="/interview/setup" className="btn-enfold inline-flex items-center gap-2 self-start sm:self-auto">
          <span>Take New Mock</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary 4 Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="paper p-5 rounded-2xl">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Readiness Score
          </span>
          <div className="font-editorial text-3xl text-[var(--text)] font-semibold mt-2">
            {stats.averageScore}%
          </div>
          <p className="text-xs text-[var(--accent)] mt-1 font-mono">
            Readiness Index: {stats.readinessPercentage}%
          </p>
        </div>

        <div className="paper p-5 rounded-2xl">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Technical Mastery
          </span>
          <div className="font-editorial text-3xl text-[var(--accent)] font-semibold mt-2">
            {radarData.find((r: any) => r.subject.includes('Technical'))?.score || 85}%
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">30% weighted impact</p>
        </div>

        <div className="paper p-5 rounded-2xl">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Communication Clarity
          </span>
          <div className="font-editorial text-3xl text-[var(--text)] font-semibold mt-2">
            {radarData.find((r: any) => r.subject.includes('Communication'))?.score || 81}%
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">20% weighted impact</p>
        </div>

        <div className="paper p-5 rounded-2xl">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Answer Relevance
          </span>
          <div className="font-editorial text-3xl text-[var(--text)] font-semibold mt-2">
            {radarData.find((r: any) => r.subject.includes('Relevance'))?.score || 88}%
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">25% weighted impact</p>
        </div>
      </div>

      {/* Main Charts: Historical Trend + Radar Dimension */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Area Chart */}
        <div className="paper p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--rule)]">
            <div>
              <h2 className="font-editorial text-lg text-[var(--text)] font-medium">
                Historical Progression
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Score progression chronologically from earlier to latest sessions
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
              Positive Trajectory
            </span>
          </div>
          <PerformanceChart data={historyTrend} />
        </div>

        {/* 5-Parameter Radar Chart */}
        <div className="paper p-6 rounded-2xl space-y-4">
          <div className="pb-3 border-b border-[var(--rule)]">
            <h2 className="font-editorial text-lg text-[var(--text)] font-medium">
              5-Parameter Competency Radar
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Multi-axis balance of candidate strengths vs. gaps
            </p>
          </div>
          <RadarScoreChart data={radarData} />
        </div>
      </div>

      {/* Interview-by-Interview Comparison Bar Chart */}
      <div className="paper p-6 rounded-2xl space-y-4">
        <div className="pb-3 border-b border-[var(--rule)]">
          <h2 className="font-editorial text-lg text-[var(--text)] font-medium">
            Interview-by-Interview Comparison
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Compare overall performance scores achieved across distinct mock sessions
          </p>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 10 }}
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis domain={[40, 100]} tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="paper p-3 rounded-xl text-xs space-y-1">
                        <p className="font-medium text-[var(--text)]">{item.name}</p>
                        <p className="text-[var(--accent)] font-mono font-semibold">Score: {item.score}%</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{item.date}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
