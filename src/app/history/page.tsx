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
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { InterviewSession } from '@/types';

export default function HistoryPage() {
  const { user } = useAuth();
  // Instant render from cache: 0ms latency
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Complete Session Archive</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Interview History & Transcripts
          </h1>
          <p className="text-sm text-navy-500 dark:text-navy-400">
            Open past mock sessions to review questions, candidate answers, and detailed model answers.
          </p>
        </div>

        <Link
          href="/interview/setup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all self-start sm:self-center"
        >
          <PlayCircle className="w-4 h-4" />
          <span>New Mock Session</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search interviews by role or title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white placeholder:text-navy-400 focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-navy-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-800 dark:text-navy-200 font-medium"
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
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 space-y-3">
          <FileText className="w-12 h-12 text-navy-300 mx-auto" />
          <h3 className="font-bold text-navy-900 dark:text-white text-base">
            No Interview Sessions Found
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            {searchTerm || roleFilter !== 'all'
              ? 'No sessions match your search filters.'
              : 'You have not conducted any mock interviews yet. Launch your first one now!'}
          </p>
          <Link
            href="/interview/setup"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
          >
            Start an Interview
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs hover:border-brand-200 dark:hover:border-brand-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base text-navy-900 dark:text-white">
                    {s.title}
                  </h3>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      s.difficulty === 'Hard'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : s.difficulty === 'FAANG'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {s.difficulty}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300 font-semibold">
                    {s.interview_type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-navy-500 dark:text-navy-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-navy-400" />
                    {new Date(s.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span>Role: {s.job_role}</span>
                  <span>•</span>
                  <span>{s.question_count} Questions</span>
                  <span>•</span>
                  <span>{Math.round((s.time_taken_seconds || 600) / 60)} mins</span>
                </div>
              </div>

              {/* Score and action */}
              <div className="flex items-center gap-5 self-end md:self-center">
                <div className="text-right">
                  <div className="text-2xl font-black text-navy-900 dark:text-white">
                    {s.overall_score ? `${s.overall_score}%` : 'In Progress'}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      s.performance_status === 'Exceptional'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : s.performance_status === 'Strong'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {s.performance_status || 'Unfinished'}
                  </div>
                </div>

                <Link
                  href={s.status === 'completed' ? `/report/${s.id}` : `/interview/${s.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-200 border border-navy-200 dark:border-navy-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  <span>{s.status === 'completed' ? 'View Report' : 'Resume'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
