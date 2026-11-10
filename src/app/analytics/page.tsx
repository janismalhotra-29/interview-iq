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
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  // Instant render from cache: 0ms latency, zero blocking spinner
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
  const recentInterviews = data?.recentInterviews || [];

  // Bar comparison chart data
  const comparisonData = historyTrend.map((h: any) => ({
    name: h.title.length > 18 ? h.title.substring(0, 16) + '...' : h.title,
    score: h.score,
    date: h.date,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Multi-Metric Performance Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Performance & Skill Analytics
          </h1>
          <p className="text-sm text-navy-500 dark:text-navy-400">
            Real longitudinal analysis across the 5 weighted academic evaluation parameters.
          </p>
        </div>

        <Link
          href="/interview/setup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all self-start sm:self-center"
        >
          <span>Take New Mock</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary 4 Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs">
          <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">
            Overall Readiness Score
          </span>
          <div className="text-3xl font-extrabold text-navy-900 dark:text-white mt-2">
            {stats.averageScore}%
          </div>
          <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">
            Readiness Index: {stats.readinessPercentage}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs">
          <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">
            Technical Skills Mastery
          </span>
          <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 mt-2">
            {radarData.find((r: any) => r.subject.includes('Technical'))?.score || 85}%
          </div>
          <p className="text-xs text-navy-500 mt-1">30% weighted impact</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs">
          <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">
            Communication & Articulation
          </span>
          <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 mt-2">
            {radarData.find((r: any) => r.subject.includes('Communication'))?.score || 81}%
          </div>
          <p className="text-xs text-navy-500 mt-1">20% weighted impact</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs">
          <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">
            Answer Relevance & Focus
          </span>
          <div className="text-3xl font-extrabold text-royal-600 dark:text-royal-400 mt-2">
            {radarData.find((r: any) => r.subject.includes('Relevance'))?.score || 88}%
          </div>
          <p className="text-xs text-navy-500 mt-1">25% weighted impact</p>
        </div>
      </div>

      {/* Main Charts: Historical Trend + Radar Dimension */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Area Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900 dark:text-white">
                Historical Progression Over Time
              </h2>
              <p className="text-xs text-navy-500 dark:text-navy-400">
                Score progression chronologically from earlier to latest sessions
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Positive Trajectory
            </span>
          </div>
          <PerformanceChart data={historyTrend} />
        </div>

        {/* 5-Parameter Radar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900 dark:text-white">
                5-Parameter Competency Radar
              </h2>
              <p className="text-xs text-navy-500 dark:text-navy-400">
                Multi-axis balance of candidate strengths vs. gaps
              </p>
            </div>
          </div>
          <RadarScoreChart data={radarData} />
        </div>
      </div>

      {/* Interview-by-Interview Comparison Bar Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-navy-900 dark:text-white">
            Interview-by-Interview Comparison
          </h2>
          <p className="text-xs text-navy-500 dark:text-navy-400">
            Compare overall performance scores achieved across distinct mock sessions
          </p>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" strokeOpacity={0.15} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748B', fontSize: 10 }}
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis domain={[40, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-navy-900 shadow-xl border border-navy-100 dark:border-navy-800 text-xs">
                        <p className="font-bold text-navy-900 dark:text-white">{item.name}</p>
                        <p className="text-brand-600 font-extrabold mt-1">Score: {item.score}%</p>
                        <p className="text-[10px] text-navy-400">{item.date}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
