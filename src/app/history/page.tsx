'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getCached, setCached, DEFAULT_DEMO_SESSIONS } from '@/lib/client-cache';
import {
  History,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  FileText,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { InterviewSession } from '@/types';

export default function HistoryPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>(() => {
    return getCached(`interviews_${user?.id}`) || DEFAULT_DEMO_SESSIONS;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    const cached = getCached(`interviews_${user.id}`);
    if (cached) {
      setSessions(cached);
    }
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/interviews?userId=${user.id}`);
        if (res.ok) {
          const json = await res.json();
          const items = json.sessions || [];
          setSessions(items);
          setCached(`interviews_${user.id}`, items);
        }
      } catch (err) {
        console.error('Error fetching interview history:', err);
      }
    };
    fetchHistory();
  }, [user]);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.job_role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || s.job_role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const uniqueRoles = Array.from(new Set(sessions.map((s) => s.job_role)));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--rule)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent)]/20 mb-3">
            <History className="w-3.5 h-3.5" />
            <span>Complete Session Archive</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[var(--text)] tracking-tight">
            Interview History &amp; <em>Transcripts</em>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-xl">
            Every technical response, voice recording, rubric breakdown, and suggested model answer preserved in clean, calm pages.
          </p>
        </div>

        <Link href="/interview/setup" className="btn-enfold inline-flex items-center gap-2 self-start sm:self-auto">
          <PlayCircle className="w-4 h-4" />
          <span>New Session</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="paper p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter sessions by role, topic or title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--text)] font-medium focus:outline-none focus:border-[var(--accent)] transition-colors"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="paper p-12 text-center rounded-2xl space-y-3">
          <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
          <h3 className="font-editorial text-lg text-[var(--text)]">
            No Interview Sessions Found
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            {searchTerm || roleFilter !== 'all'
              ? 'No sessions match your search filters.'
              : 'You have not conducted any mock interviews yet. Launch your first one now.'}
          </p>
          <div className="pt-2">
            <Link href="/interview/setup" className="btn-enfold inline-flex items-center gap-2">
              <span>Start an Interview</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((s) => (
            <div
              key={s.id}
              className="paper p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[var(--accent)]/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-editorial text-lg text-[var(--text)] font-medium">
                    {s.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
                    {s.difficulty}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono text-[var(--text-muted)] border border-[var(--rule)]">
                    {s.interview_type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 opacity-60" />
                    {new Date(s.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[var(--rule)]">/</span>
                  <span>Target: <strong className="text-[var(--text)] font-medium">{s.job_role}</strong></span>
                  <span className="text-[var(--rule)]">/</span>
                  <span>{s.question_count} Questions</span>
                  <span className="text-[var(--rule)]">/</span>
                  <span>{Math.round((s.time_taken_seconds || 600) / 60)} mins</span>
                </div>
              </div>

              {/* Score and action */}
              <div className="flex items-center gap-6 self-end md:self-center">
                <div className="text-right">
                  <div className="font-editorial text-2xl text-[var(--text)] font-semibold">
                    {s.overall_score ? `${s.overall_score}%` : 'Pending'}
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)]">
                    {s.performance_status || 'Unfinished'}
                  </div>
                </div>

                <Link
                  href={s.status === 'completed' ? `/report/${s.id}` : `/interview/${s.id}`}
                  className="btn-enfold-ghost inline-flex items-center gap-1.5 text-xs py-2 px-4"
                >
                  <span>{s.status === 'completed' ? 'View Report' : 'Resume'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
