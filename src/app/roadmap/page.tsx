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
} from 'lucide-react';
import { LearningRecommendation } from '@/types';

export default function RoadmapPage() {
  const { user, profile } = useAuth();
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
  const progressPercent =
    recommendations.length > 0 ? Math.round((completedCount / recommendations.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--rule)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent)]/20 mb-3">
            <Map className="w-3.5 h-3.5" />
            <span>AI Curriculum Engine</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[var(--text)] tracking-tight">
            Personalized Learning <em>Roadmap</em>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-xl">
            Revision tracks dynamically compiled from weaknesses and missed concepts in recent mock interviews.
          </p>
        </div>

        <Link href="/interview/setup" className="btn-enfold inline-flex items-center gap-2 self-start sm:self-auto">
          <PlayCircle className="w-4 h-4" />
          <span>Practice Weak Topics</span>
        </Link>
      </div>

      {/* Progress Tracker Card - Enfold Paper Style */}
      <div className="paper p-6 sm:p-7 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-editorial text-xl text-[var(--text)] flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--accent)]" />
              <span>Target Role: {profile?.target_role || 'Full Stack Engineer'}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {completedCount} of {recommendations.length} recommended topics mastered
            </p>
          </div>
          <div className="font-editorial text-2xl font-semibold text-[var(--accent)] sm:text-right">
            {progressPercent}% <span className="text-xs font-mono font-normal text-[var(--text-muted)]">Completed</span>
          </div>
        </div>

        <div className="w-full h-2 rounded-full bg-[var(--rule)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Recommendation Action Cards List */}
      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="paper p-10 text-center rounded-2xl text-xs text-[var(--text-muted)]">
            No recommendations generated yet. Complete a mock interview session to unlock tailored practice topics.
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div
              key={rec.id || idx}
              className={`paper p-5 sm:p-6 rounded-2xl transition-all ${
                rec.is_completed ? 'opacity-65' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleComplete(rec.id)}
                  className="mt-1 shrink-0 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  {rec.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3
                      className={`font-editorial text-lg text-[var(--text)] font-medium ${
                        rec.is_completed ? 'line-through text-[var(--text-muted)]' : ''
                      }`}
                    >
                      {rec.topic}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--rule)] text-[var(--text-muted)]">
                      Priority #{idx + 1}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {rec.description || (rec as any).reason}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {rec.resource_url && (
                      <a
                        href={rec.resource_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline font-mono"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Recommended Guide</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <Link
                      href={`/interview/setup?topic=${encodeURIComponent(rec.topic)}`}
                      className="inline-flex items-center gap-1 text-xs text-[var(--text)] hover:text-[var(--accent)] font-mono ml-auto"
                    >
                      <span>Drill this topic</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
