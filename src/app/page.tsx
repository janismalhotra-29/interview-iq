'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  PlayCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
  Target,
  FileCheck,
  Mic,
  Award,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Terminal,
} from 'lucide-react';

export default function LandingPage() {
  const [activeDemoRole, setActiveDemoRole] = useState<'fs' | 'fe' | 'ai' | 'hr'>('fs');
  const [demoUserAnswer, setDemoUserAnswer] = useState(
    'React uses a Virtual DOM tree. When state changes, it compares the old and new tree to calculate minimal DOM operations using reconciliation.'
  );
  const [showDemoEvaluation, setShowDemoEvaluation] = useState(false);
  const [isEvaluatingDemo, setIsEvaluatingDemo] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sampleDemoQuestions = {
    fs: {
      role: 'Full Stack Developer',
      question: 'How does React’s Virtual DOM and Reconciliation algorithm work, and how does React 18 enable concurrent rendering?',
      category: 'React Architecture',
      defaultAnswer: 'React maintains an in-memory Virtual DOM. When state changes, it computes a diff using reconciliation. React 18 introduces Fiber time-slicing which lets urgent user interactions interrupt background re-renders.',
      modelAnswer: 'React maintains a lightweight Virtual DOM tree in memory. On state updates, reconciliation performs a heuristic O(n) tree diff. In React 18 Fiber architecture, work units are interruptible, allowing urgent events to take precedence via useTransition.',
      score: 88,
      tech: 90,
      relevance: 92,
      comm: 84,
      comp: 82,
      ps: 85,
    },
    fe: {
      role: 'Frontend Developer',
      question: 'Explain Core Web Vitals (LCP, INP, CLS). What techniques would you use to diagnose and fix a slow LCP?',
      category: 'Performance Optimization',
      defaultAnswer: 'LCP measures largest visible element loading time. INP measures interaction latency, and CLS measures layout shifts. We can fix LCP with image optimization and preloading critical assets.',
      modelAnswer: 'LCP targets < 2.5s for main content. Optimize it by: 1) Preloading hero images with fetchpriority="high"; 2) Compressing with AVIF/WebP; 3) Minimizing render-blocking CSS/JS; 4) Utilizing edge CDNs.',
      score: 86,
      tech: 88,
      relevance: 90,
      comm: 82,
      comp: 80,
      ps: 85,
    },
    ai: {
      role: 'AI / ML Engineer',
      question: 'What is Retrieval-Augmented Generation (RAG)? How do you prevent hallucinations and optimize vector retrieval accuracy?',
      category: 'LLM Systems',
      defaultAnswer: 'RAG retrieves documents from a vector database using embeddings and adds them to the LLM prompt. We prevent hallucinations by using cross-encoder rerankers and strict system guardrails.',
      modelAnswer: 'RAG combines sparse BM25 and dense embedding hybrid search. Hallucinations are mitigated using semantic chunking, cross-encoder re-ranking (e.g. Cohere), prompt attribution constraints, and post-generation grounding checks.',
      score: 92,
      tech: 94,
      relevance: 95,
      comm: 88,
      comp: 88,
      ps: 92,
    },
    hr: {
      role: 'Behavioral & Leadership',
      question: 'Tell me about a time when you faced a difficult deadline or project conflict. How did you resolve it?',
      category: 'Behavioral / STAR',
      defaultAnswer: 'In my final year college project, we were running behind schedule. I prioritized core modules, redistributed workload based on strengths, and we delivered on time.',
      modelAnswer: 'Using STAR: In our e-commerce hackathon (Situation), we had 24 hours left with payment gateway unintegrated (Task). I conducted a 15-min triage, delegated mock stubs (Action), and shipped MVP 2 hours early with 100% demo success (Result).',
      score: 85,
      tech: 80,
      relevance: 90,
      comm: 92,
      comp: 82,
      ps: 84,
    },
  };

  const handleTestDemoEvaluation = () => {
    setIsEvaluatingDemo(true);
    setTimeout(() => {
      setIsEvaluatingDemo(false);
      setShowDemoEvaluation(true);
    }, 600);
  };

  const currentDemo = sampleDemoQuestions[activeDemoRole];

  const faqs = [
    {
      q: 'Is InterviewIQ free to use?',
      a: 'Yes, 100% free. You can conduct technical and behavioral mock sessions, review model answers, and export reports without credit card or payment.',
    },
    {
      q: 'Do I have to speak, or can I type answers?',
      a: 'Both are supported. Click "Voice Input" to transcribe real-time speech via your browser mic, or type code and explanations directly in the text editor.',
    },
    {
      q: 'Does it work for college graduates and early career roles?',
      a: 'Yes. In the setup screen, select "Beginner" or "Intermediate" difficulty with roles like Software Developer or HR to calibrate questions for campus placements.',
    },
    {
      q: 'How does resume parsing work?',
      a: 'Upload a resume file (.pdf, .txt, .md) or paste resume text. InterviewIQ extracts key skills and frameworks to tailor the question set to your background.',
    },
    {
      q: 'Where is my interview history stored?',
      a: 'All candidate profiles, interview sessions, spoken transcripts, and evaluation results persist locally in your database file.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="pt-12 sm:pt-16 pb-8 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Technical & behavioral mock simulator</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-3xl mx-auto leading-tight">
          Technical interview preparation with real-time rubric feedback
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Practice coding, architecture, and behavioral questions. Speak your answers aloud, receive follow-up questions, and evaluate responses across five weighted metrics.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/interview/setup"
            prefetch={true}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:opacity-90 text-white dark:text-zinc-900 font-medium text-xs transition-opacity"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start mock session</span>
          </Link>

          <Link
            href="/dashboard"
            prefetch={true}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#111215] hover:bg-zinc-50 dark:hover:bg-[#181A1F] text-zinc-700 dark:text-zinc-300 font-medium text-xs border border-zinc-200 dark:border-[#1F2228] transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-zinc-500" />
            <span>Open dashboard</span>
          </Link>
        </div>

        {/* 3-Step Process Ribbon */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-lg bg-white dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228]">
            <div className="text-[11px] font-mono text-zinc-400">01</div>
            <p className="font-medium text-xs text-zinc-900 dark:text-zinc-100 mt-1">Select role & difficulty</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Frontend, Backend, AI, System Design, HR</p>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228]">
            <div className="text-[11px] font-mono text-zinc-400">02</div>
            <p className="font-medium text-xs text-zinc-900 dark:text-zinc-100 mt-1">Speak or type your answer</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Real-time voice transcription with mic</p>
          </div>

          <div className="p-3.5 rounded-lg bg-white dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228]">
            <div className="text-[11px] font-mono text-zinc-400">03</div>
            <p className="font-medium text-xs text-zinc-900 dark:text-zinc-100 mt-1">Review weighted rubric score</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">5-parameter breakdown & model answer</p>
          </div>
        </div>

        {/* 2. Interactive "Try a Question" Sandbox */}
        <div className="mt-12 max-w-3xl mx-auto rounded-xl bg-white dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228] p-5 text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-[#1F2228]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-medium text-xs text-zinc-800 dark:text-zinc-200">
                Evaluation preview
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">Select a sample discipline:</span>
          </div>

          {/* Role selector pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'fs', label: 'Full Stack' },
              { id: 'fe', label: 'Frontend' },
              { id: 'ai', label: 'AI / ML' },
              { id: 'hr', label: 'Behavioral' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveDemoRole(tab.id as any);
                  setDemoUserAnswer(sampleDemoQuestions[tab.id as keyof typeof sampleDemoQuestions].defaultAnswer);
                  setShowDemoEvaluation(false);
                }}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeDemoRole === tab.id
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium'
                    : 'bg-zinc-100 dark:bg-[#181A1F] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Question Box */}
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-[#0E0F12] border border-zinc-200 dark:border-[#1F2228] space-y-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>{currentDemo.category}</span>
              <span>{currentDemo.role}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
              {currentDemo.question}
            </p>
          </div>

          {/* Answer Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-500">
              <span className="font-mono">Candidate answer</span>
              <span>Editable sample</span>
            </div>
            <textarea
              value={demoUserAnswer}
              onChange={(e) => setDemoUserAnswer(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-[#0E0F12] border border-zinc-200 dark:border-[#1F2228] text-xs text-zinc-900 dark:text-zinc-100 font-mono leading-relaxed focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-zinc-500">
              Computes weighted marks across Technical, Relevance, Communication, Completeness, and Problem Solving.
            </p>
            <button
              type="button"
              onClick={handleTestDemoEvaluation}
              disabled={isEvaluatingDemo}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity"
            >
              {isEvaluatingDemo ? 'Evaluating answer...' : 'Evaluate response'}
            </button>
          </div>

          {/* Live Evaluation Result Card */}
          {showDemoEvaluation && (
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-[#0E0F12] border border-zinc-200 dark:border-[#1F2228] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-[#1F2228]">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Assessment verdict</span>
                  <p className="font-medium text-xs text-zinc-900 dark:text-zinc-100">Strong technical articulation</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500">Overall score</span>
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {currentDemo.score}%
                  </p>
                </div>
              </div>

              {/* 5-parameter breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {[
                  { label: 'Technical (30%)', val: currentDemo.tech },
                  { label: 'Relevance (25%)', val: currentDemo.relevance },
                  { label: 'Communication (20%)', val: currentDemo.comm },
                  { label: 'Completeness (15%)', val: currentDemo.comp },
                  { label: 'Problem Solving (10%)', val: currentDemo.ps },
                ].map((item, idx) => (
                  <div key={idx} className="p-2 rounded bg-white dark:bg-[#14161C] border border-zinc-200 dark:border-[#1F2228] text-center">
                    <span className="text-[10px] text-zinc-500 block">{item.label}</span>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block tabular-nums">
                      {item.val}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Model answer */}
              <div className="p-3 rounded bg-white dark:bg-[#14161C] border border-zinc-200 dark:border-[#1F2228] text-xs space-y-1">
                <span className="font-medium text-[11px] text-zinc-500 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Model answer suggestion</span>
                </span>
                <p className="text-zinc-600 dark:text-zinc-300 text-[11px] leading-relaxed">
                  {currentDemo.modelAnswer}
                </p>
              </div>

              <div className="text-right pt-1">
                <Link
                  href="/interview/setup"
                  className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  <span>Launch full 5-question mock session</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. The Traditional Way vs InterviewIQ Way */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs font-mono text-zinc-500">Methodology</p>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Isolated reading vs active vocal simulation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228] space-y-3">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium text-xs">
              <XCircle className="w-4 h-4 text-zinc-400" />
              <span>Static solution memorization</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 shrink-0"></span>
                <span>Reading solutions without verifying if your verbal explanation is cohesive under pressure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 shrink-0"></span>
                <span>No calibration on whether technical terms or algorithmic edge-cases are missed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 shrink-0"></span>
                <span>Hesitation and freezing when an interviewer probes with unexpected follow-up scenarios.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228] space-y-3">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-medium text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Dynamic adaptive simulation</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Verbal practice using browser Speech-to-Text with audio narration.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Instant scoring on 5 weighted dimensions with missing concept identification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Adaptive follow-up questions triggered automatically when candidate answers are brief.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs font-mono text-zinc-500">Workflow</p>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Four-step interview cycle
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              step: '01',
              title: 'Role & depth',
              desc: 'Select engineering role, experience level, question count, and time allowance.',
              icon: Target,
            },
            {
              step: '02',
              title: 'Resume context',
              desc: 'Optionally upload your resume to generate questions directly grounded in your background.',
              icon: FileCheck,
            },
            {
              step: '03',
              title: 'Vocal session',
              desc: 'Listen to spoken prompts, dictate answers with speech-to-text, and resolve follow-up inquiries.',
              icon: Mic,
            },
            {
              step: '04',
              title: 'Scorecard & PDF',
              desc: 'Analyze score breakdown, read model answers, and print a consolidated PDF evaluation.',
              icon: Award,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228] space-y-2"
              >
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="font-mono text-xs">{item.step}</span>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-medium text-xs text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FAQs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs font-mono text-zinc-500">FAQ</p>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Common questions
          </h2>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-[#1F2228] border-y border-zinc-200 dark:border-[#1F2228]">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-1 flex items-center justify-between text-left gap-4 text-xs font-medium text-zinc-900 dark:text-zinc-100"
                >
                  <span>{faq.q}</span>
                  <div className="text-zinc-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>
                {isOpen && (
                  <p className="pt-2 text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Clean Bottom Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-xl bg-zinc-100 dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Ready to evaluate your interview readiness?
            </h3>
            <p className="text-xs text-zinc-500">
              Configure your role, question count, and time allowance to start immediately.
            </p>
          </div>
          <Link
            href="/interview/setup"
            className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            Launch session
          </Link>
        </div>
      </section>
    </div>
  );
}
