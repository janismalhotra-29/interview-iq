'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCached, setCached } from '@/lib/client-cache';
import RadarScoreChart from '@/components/RadarScoreChart';
import {
  Award,
  Download,
  Share2,
  Printer,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { InterviewSession } from '@/types';

export default function InterviewReportPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<InterviewSession | null>(() => {
    return getCached<InterviewSession>(`session_${sessionId}`);
  });
  const [loading, setLoading] = useState<boolean>(() => !getCached(`session_${sessionId}`));
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const cached = getCached<InterviewSession>(`session_${sessionId}`);
    if (cached) {
      setSession(cached);
      setLoading(false);
    }
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/interviews/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
          setCached(`session_${sessionId}`, data.session);
        } else {
          if (!cached) setErrorMsg('Failed to fetch interview report.');
        }
      } catch (err: any) {
        if (!cached) setErrorMsg(err.message || 'Error loading report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [sessionId]);

  const handlePrintPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-navy-500">Compiling multi-dimensional AI evaluation report...</p>
      </div>
    );
  }

  if (errorMsg || !session) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-200 text-center space-y-4">
        <h2 className="text-lg font-bold text-navy-900 dark:text-white">Report Not Found</h2>
        <p className="text-xs text-navy-500">{errorMsg || 'Could not locate evaluation report.'}</p>
        <Link href="/dashboard" className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const questions = session.questions || [];
  const evaluatedQuestions = questions.filter((q) => Boolean(q.evaluation));

  // Compute averages
  const count = evaluatedQuestions.length || 1;
  const techAvg = Math.round(evaluatedQuestions.reduce((a, q) => a + (q.evaluation?.technical_accuracy_score || 0), 0) / count);
  const relAvg = Math.round(evaluatedQuestions.reduce((a, q) => a + (q.evaluation?.relevance_score || 0), 0) / count);
  const commAvg = Math.round(evaluatedQuestions.reduce((a, q) => a + (q.evaluation?.communication_score || 0), 0) / count);
  const compAvg = Math.round(evaluatedQuestions.reduce((a, q) => a + (q.evaluation?.completeness_score || 0), 0) / count);
  const psAvg = Math.round(evaluatedQuestions.reduce((a, q) => a + (q.evaluation?.problem_solving_score || 0), 0) / count);

  const radarData = [
    { subject: 'Technical Accuracy (30%)', score: techAvg },
    { subject: 'Relevance (25%)', score: relAvg },
    { subject: 'Communication (20%)', score: commAvg },
    { subject: 'Completeness (15%)', score: compAvg },
    { subject: 'Problem-Solving (10%)', score: psAvg },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 print:p-0 print:m-0 print:max-w-full">
      {/* Action Navigation Header (Hidden in Print Mode) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 dark:text-navy-300 hover:text-brand-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-navy-700 dark:text-navy-200 bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 hover:bg-navy-50 shadow-xs transition-all"
          >
            <Printer className="w-4 h-4 text-brand-600" />
            <span>Download PDF / Print</span>
          </button>
          <Link
            href="/interview/setup"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-royal-600 hover:from-brand-700 shadow-md shadow-brand-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Retake / New Mock</span>
          </Link>
        </div>
      </div>

      {/* Main Report Card / Printable Sheet */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Report Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-navy-100 dark:border-navy-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800">
                AI Evaluation Report
              </span>
              <span className="text-xs text-navy-500">ID: {session.id.substring(0, 12)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              {session.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-navy-500 dark:text-navy-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-navy-400" />
                {new Date(session.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-navy-400" />
                {Math.round((session.time_taken_seconds || 900) / 60)} min spent
              </span>
              <span>•</span>
              <span>{session.job_role} ({session.experience_level})</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 font-semibold">
                {session.difficulty} Difficulty
              </span>
            </div>
          </div>

          {/* Overall Score Badge */}
          <div className="flex flex-col items-center sm:items-end justify-center p-5 rounded-2xl bg-gradient-to-tr from-navy-50 to-brand-50/50 dark:from-navy-900/80 dark:to-brand-950/40 border border-navy-200/80 dark:border-navy-700 shrink-0">
            <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider">Overall Assessment</span>
            <div className="text-4xl font-black text-navy-900 dark:text-white mt-1">
              {session.overall_score || 82}%
            </div>
            <span
              className={`mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                (session.overall_score || 82) >= 85
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : (session.overall_score || 82) >= 75
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {session.performance_status || 'Strong'}
            </span>
          </div>
        </div>

        {/* 5 Weighted Parameters Breakdown Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900 dark:text-white">
              5-Parameter Evaluator Breakdown
            </h2>
            <span className="text-xs text-navy-400">Strictly weighted formula applied</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Technical Accuracy', weight: '30%', score: techAvg, color: 'text-brand-600' },
              { label: 'Relevance', weight: '25%', score: relAvg, color: 'text-royal-600' },
              { label: 'Communication', weight: '20%', score: commAvg, color: 'text-violet-600' },
              { label: 'Completeness', weight: '15%', score: compAvg, color: 'text-emerald-600' },
              { label: 'Problem-Solving', weight: '10%', score: psAvg, color: 'text-amber-600' },
            ].map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-navy-50/70 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider block">
                    Weight: {p.weight}
                  </span>
                  <span className="text-xs font-bold text-navy-800 dark:text-navy-200 mt-1 block">
                    {p.label}
                  </span>
                </div>
                <div className={`text-2xl font-black ${p.color} mt-2`}>
                  {p.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Radar & Executive Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-800/40 border border-navy-100 dark:border-navy-750">
            <h3 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-2">
              Performance Radar Profile
            </h3>
            <RadarScoreChart data={radarData} />
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-navy-50/70 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-800 space-y-3">
              <h3 className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Observed Key Strengths</span>
              </h3>
              <ul className="space-y-2 text-xs text-navy-700 dark:text-navy-300">
                {evaluatedQuestions.flatMap((q) => q.evaluation?.strengths || []).slice(0, 3).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-navy-50/70 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-800 space-y-3">
              <h3 className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Critical Areas for Improvement</span>
              </h3>
              <ul className="space-y-2 text-xs text-navy-700 dark:text-navy-300">
                {evaluatedQuestions.flatMap((q) => q.evaluation?.weaknesses || []).slice(0, 3).map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Question-by-Question Deep Dive */}
        <div className="space-y-6 pt-4 border-t border-navy-100 dark:border-navy-800">
          <h2 className="text-lg font-bold text-navy-900 dark:text-white">
            Question-by-Question Transcript & AI Evaluation
          </h2>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const evalRes = q.evaluation;
              const ans = q.answer;

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl bg-navy-50/50 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-800 space-y-4"
                >
                  {/* Question header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-navy-500 dark:text-navy-400">
                        {q.category}
                      </span>
                      {q.is_followup && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold">
                          Follow-up
                        </span>
                      )}
                    </div>

                    {evalRes && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-navy-400">Score:</span>
                        <span className="text-sm font-extrabold text-navy-900 dark:text-white px-2.5 py-0.5 rounded-lg bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700">
                          {evalRes.weighted_total_score}%
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-navy-900 dark:text-white text-base">
                    {q.question_text}
                  </h3>

                  {/* Candidate's submitted answer */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-750 space-y-1.5">
                    <div className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Candidate Response</span>
                      <span className="capitalize">{ans?.input_method || 'Text'} Mode</span>
                    </div>
                    <p className="text-xs text-navy-700 dark:text-navy-300 leading-relaxed font-mono">
                      {ans?.answer_text || 'No response recorded.'}
                    </p>
                  </div>

                  {/* AI Evaluation Analysis */}
                  {evalRes && (
                    <div className="space-y-3 pt-2">
                      <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 text-xs text-navy-700 dark:text-navy-300 space-y-2">
                        <span className="font-bold text-brand-800 dark:text-brand-300 flex items-center gap-1.5">
                          <BrainCircuit className="w-4 h-4 text-brand-600" />
                          <span>AI Answer Quality Analysis</span>
                        </span>
                        <p className="leading-relaxed">
                          {evalRes.answer_quality_analysis}
                        </p>
                      </div>

                      {/* Model Answer Suggestion */}
                      {evalRes.model_answer_suggestion && (
                        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-navy-700 dark:text-navy-300 space-y-2">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-emerald-600" />
                            <span>Recommended Exemplary Model Answer</span>
                          </span>
                          <p className="leading-relaxed">
                            {evalRes.model_answer_suggestion}
                          </p>
                        </div>
                      )}

                      {/* Missing Concepts tags */}
                      {evalRes.missing_concepts && evalRes.missing_concepts.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-semibold text-navy-500">Missing Concepts:</span>
                          {evalRes.missing_concepts.map((mc, mIdx) => (
                            <span
                              key={mIdx}
                              className="px-2 py-0.5 rounded-full text-[10px] bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            >
                              {mc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ethical Academic AI Disclaimer */}
        <div className="p-5 rounded-2xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200/80 dark:border-navy-800 text-xs text-navy-500 dark:text-navy-400 space-y-2">
          <div className="flex items-center gap-2 font-bold text-navy-800 dark:text-navy-200">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Ethical Evaluation Disclosure & Methodology</span>
          </div>
          <p className="leading-relaxed">
            Evaluation scores are automated approximations derived from semantic keyword density, technical accuracy against industry design patterns, structure, and depth heuristics. They are generated solely for pedagogical training and mock interview rehearsal. They do not constitute objective claims regarding candidate employability, emotional confidence, or personality.
          </p>
        </div>
      </div>
    </div>
  );
}
