'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getCached, setCached, DEFAULT_DEMO_ANALYTICS } from '@/lib/client-cache';
import {
  Map,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Code,
  Sparkles,
  PlayCircle,
  Target,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { LearningRecommendation } from '@/types';

export default function RoadmapPage() {
  const { user, profile } = useAuth();
  // Instant render from cache: 0ms latency
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>(() => {
    const cached = getCached<any>(`analytics_${user?.id}`);
    return cached?.recommendations || DEFAULT_DEMO_ANALYTICS.recommendations;
  });

  useEffect(() => {
    if (!user) return;
    const cached = getCached<any>(`analytics_${user.id}`);
    if (cached?.recommendations) {
      setRecommendations(cached.recommendations);
    }
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`/api/analytics?userId=${user.id}`);
        if (res.ok) {
          const json = await res.json();
          const items = json.recommendations || [];
          setRecommendations(items);
          setCached(`analytics_${user.id}`, json);
        }
      } catch (err) {
        console.error('Error fetching roadmap:', err);
      }
    };
    fetchRoadmap();
  }, [user]);

  const toggleComplete = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_completed: !r.is_completed } : r))
    );
  };

  const completedCount = recommendations.filter((r) => r.is_completed).length;
  const progressPercent = recommendations.length > 0 ? Math.round((completedCount / recommendations.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
            <Map className="w-3.5 h-3.5" />
            <span>AI Curriculum Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Personalized Learning Roadmap
          </h1>
          <p className="text-sm text-navy-500 dark:text-navy-400">
            Dynamically customized revision tracks generated from your weaknesses and missed concepts in recent mock interviews.
          </p>
        </div>

        <Link
          href="/interview/setup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all self-start sm:self-center"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Launch Recommended Mock</span>
        </Link>
      </div>

      {/* Progress Tracker Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 to-brand-950 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Target Role: {profile?.target_role || 'Full Stack Developer'}</span>
            </h2>
            <p className="text-xs text-navy-300 mt-1">
              {completedCount} of {recommendations.length} recommended topics mastered
            </p>
          </div>
          <div className="text-2xl font-black text-brand-300 sm:text-right">
            {progressPercent}% Completed
          </div>
        </div>

        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Recommendation Action Cards List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 text-xs text-navy-400">
            No recommendations generated yet. Complete a mock interview session to unlock tailored practice topics.
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div
              key={rec.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                rec.is_completed
                  ? 'bg-navy-50/40 dark:bg-navy-900/20 border-navy-200/50 dark:border-navy-800 opacity-75'
                  : 'bg-white dark:bg-navy-850 border-navy-100 dark:border-navy-750 shadow-xs hover:border-brand-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggleComplete(rec.id)}
                  className="mt-1 text-navy-400 hover:text-brand-600 transition-colors shrink-0"
                >
                  {rec.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-base text-navy-900 dark:text-white">
                      {rec.topic}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200/50">
                      {rec.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300">
                      {rec.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-navy-600 dark:text-navy-300 leading-relaxed">
                    {rec.description}
                  </p>

                  {rec.resource_url && (
                    <div className="pt-1">
                      <a
                        href={rec.resource_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Curated Study Guide / Problem</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => toggleComplete(rec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    rec.is_completed
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                      : 'bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200 border-navy-200 dark:border-navy-700 hover:bg-navy-200'
                  }`}
                >
                  {rec.is_completed ? 'Completed' : 'Mark Done'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
