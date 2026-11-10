'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  BrainCircuit,
  Mic,
  BarChart3,
  CheckCircle2,
  XCircle,
  Layers,
  Award,
  ShieldCheck,
  Zap,
  Target,
  FileCheck,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  Volume2,
  Lightbulb,
  FileText,
  Compass,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  // Interactive Live Demo Sandbox state
  const [activeDemoRole, setActiveDemoRole] = useState<'fs' | 'fe' | 'ai' | 'hr'>('fs');
  const [demoUserAnswer, setDemoUserAnswer] = useState(
    'React uses a Virtual DOM tree. When state changes, it compares the old and new tree to calculate minimal DOM operations using reconciliation.'
  );
  const [showDemoEvaluation, setShowDemoEvaluation] = useState(false);
  const [isEvaluatingDemo, setIsEvaluatingDemo] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sampleDemoQuestions = {
    fs: {
      role: 'Full Stack Developer',
      question: 'How does React’s Virtual DOM and Reconciliation algorithm work, and how does React 18 enable concurrent rendering?',
      category: 'React Architecture & Performance',
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
      category: 'Web Performance Optimization',
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
      category: 'LLMs & Generative AI',
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
      role: 'HR & Campus Behavioral',
      question: 'Tell me about a time when you faced a difficult deadline or project conflict. How did you resolve it?',
      category: 'STAR Method & Teamwork',
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
    }, 700);
  };

  const currentDemo = sampleDemoQuestions[activeDemoRole];

  const faqs = [
    {
      q: 'Is InterviewIQ really free to use?',
      a: 'Yes, 100% free! You can take unlimited mock interviews, test both technical and HR questions, review model answers, and download PDF reports without entering any payment information.',
    },
    {
      q: 'Do I have to speak into a microphone, or can I type my answers?',
      a: 'Both are fully supported! If you want realistic verbal practice, click "Voice Input" and your microphone will transcribe your speech in real time. If you prefer typing code and explanations, you can type directly into the answer editor.',
    },
    {
      q: 'Does it work for college freshers with zero industry experience?',
      a: 'Absolutely. In the Interview Setup, you can select "Beginner" level and choose "HR / Behavioral" or "Frontend / Software Developer". The AI will calibrate question difficulty to college placements and campus hiring standards.',
    },
    {
      q: 'How does the Resume-Based question feature work?',
      a: 'You can upload your resume file (.pdf, .txt, .md) or paste your resume text. InterviewIQ automatically extracts your projects, programming languages, and tools, and frames questions based directly on your personal achievements.',
    },
    {
      q: 'Is my interview data saved if I close the browser?',
      a: 'Yes. All candidate profiles, interview sessions, spoken answers, and AI scores are permanently saved in your local database file on your machine. You can review past interviews in the History tab anytime.',
    },
  ];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* 1. Hero Section with Clear Value Proposition */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow backdrop circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-brand-500/15 via-royal-500/10 to-violet-500/15 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800 shadow-xs">
            <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
            <span>AI-Powered Technical & HR Mock Interview Simulator</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-navy-950 dark:text-white tracking-tight leading-[1.1]">
            Ace Your Next Interview{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-royal-600 to-violet-600">
              with AI.
            </span>
          </h1>

          {/* Crystal Clear Subtitle for First-Time Users */}
          <p className="text-base sm:text-lg text-navy-600 dark:text-navy-300 max-w-2xl mx-auto leading-relaxed">
            Stop memorizing answers alone. Practice live technical and HR mock interviews with an AI coach that <strong>listens to your voice</strong>, asks follow-up questions, and scores you on <strong>5 industry rubrics</strong>.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/interview/setup"
              prefetch={true}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-royal-600 to-violet-600 hover:from-brand-700 hover:to-royal-700 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.99]"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Start Free Mock Interview</span>
            </Link>

            <Link
              href="/dashboard"
              prefetch={true}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white dark:bg-navy-850 hover:bg-navy-50 dark:hover:bg-navy-800 text-navy-800 dark:text-navy-200 font-bold text-sm border border-navy-200 dark:border-navy-700 shadow-xs transition-all"
            >
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <span>Explore Student Dashboard</span>
            </Link>
          </div>

          {/* 3-Step Simple Process Ribbon (Instant clarity for beginners) */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-800 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div className="text-xs">
                <p className="font-bold text-navy-900 dark:text-white">Choose Your Role</p>
                <p className="text-[11px] text-navy-500">Software, Frontend, AI, HR</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-800 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div className="text-xs">
                <p className="font-bold text-navy-900 dark:text-white">Speak or Type Answer</p>
                <p className="text-[11px] text-navy-500">Live Voice Speech-to-Text</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-800 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div className="text-xs">
                <p className="font-bold text-navy-900 dark:text-white">Get Instant AI Score</p>
                <p className="text-[11px] text-navy-500">5-Metric Rubric + Model Answer</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive "Try a Live Question Now" Sandbox Widget */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white dark:bg-navy-900 border border-navy-200/80 dark:border-navy-800 p-4 sm:p-6 shadow-2xl text-left space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-100 dark:border-navy-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="font-bold text-xs uppercase tracking-wider text-navy-800 dark:text-navy-200">
                Interactive Live Preview (Try It Now)
              </span>
            </div>
            <div className="text-xs text-navy-500">Click a role to test sample AI evaluation:</div>
          </div>

          {/* Role selector pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'fs', label: 'Full Stack Dev' },
              { id: 'fe', label: 'Frontend Dev' },
              { id: 'ai', label: 'AI/ML Engineer' },
              { id: 'hr', label: 'Campus Placement / HR' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveDemoRole(tab.id as any);
                  setDemoUserAnswer(sampleDemoQuestions[tab.id as keyof typeof sampleDemoQuestions].defaultAnswer);
                  setShowDemoEvaluation(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeDemoRole === tab.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:bg-navy-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Question Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-brand-600">
              <span>{currentDemo.category}</span>
              <span className="text-navy-400">Target Role: {currentDemo.role}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-navy-900 dark:text-white">
              "{currentDemo.question}"
            </p>
          </div>

          {/* Answer Preview Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider flex items-center justify-between">
              <span>Candidate Answer Preview:</span>
              <span className="text-[11px] font-normal text-navy-400">You can edit this text</span>
            </label>
            <textarea
              value={demoUserAnswer}
              onChange={(e) => setDemoUserAnswer(e.target.value)}
              rows={3}
              className="w-full p-3.5 rounded-2xl bg-navy-50/70 dark:bg-navy-950/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-brand-500 font-mono"
            />
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-navy-500">
              See how the AI evaluation engine calculates marks across 5 parameters.
            </p>
            <button
              type="button"
              onClick={handleTestDemoEvaluation}
              disabled={isEvaluatingDemo}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-royal-600 hover:from-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isEvaluatingDemo ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Check AI Score Preview</span>
                </>
              )}
            </button>
          </div>

          {/* Live Evaluation Result Card (Reveals upon click) */}
          {showDemoEvaluation && (
            <div className="p-5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-200/60 dark:border-brand-800">
                <div>
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                    Instant AI Evaluation Result
                  </span>
                  <h4 className="font-extrabold text-sm text-navy-900 dark:text-white">
                    Strong Technical Articulation
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-navy-500">Overall Weighted Score:</span>
                  <span className="text-lg font-black text-brand-600 dark:text-brand-300">
                    {currentDemo.score}%
                  </span>
                </div>
              </div>

              {/* 5-parameter mini breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { label: 'Technical (30%)', val: currentDemo.tech },
                  { label: 'Relevance (25%)', val: currentDemo.relevance },
                  { label: 'Communication (20%)', val: currentDemo.comm },
                  { label: 'Completeness (15%)', val: currentDemo.comp },
                  { label: 'Problem Solving (10%)', val: currentDemo.ps },
                ].map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-brand-100 dark:border-brand-900/40 text-center">
                    <span className="text-[10px] text-navy-400 font-semibold block">{item.label}</span>
                    <span className="text-xs font-extrabold text-navy-900 dark:text-white mt-0.5 block">
                      {item.val}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Model answer */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-brand-100 dark:border-brand-900/40 text-xs space-y-1">
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Exemplary Model Answer Suggestion:</span>
                </span>
                <p className="text-navy-600 dark:text-navy-300 text-[11px] leading-relaxed">
                  {currentDemo.modelAnswer}
                </p>
              </div>

              <div className="text-center pt-1">
                <Link
                  href="/interview/setup"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>Ready for a full 5-question mock session? Click here to start free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. "The Old Way vs. The InterviewIQ Way" (Why you need this app) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Clear Difference
          </span>
          <h2 className="text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Why Traditional Practice Fails Most Candidates
          </h2>
          <p className="text-sm text-navy-500 dark:text-navy-400">
            Reading static answers in textbooks won't prepare you for live interview pressure. Here is how InterviewIQ transforms your preparation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old Way */}
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-base">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>The Traditional Way (Isolated Study)</span>
            </div>
            <ul className="space-y-3 text-xs text-navy-700 dark:text-navy-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <span>Memorizing hundreds of static solutions without knowing if your verbal articulation is clear.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <span>Practicing in front of a mirror with zero feedback on whether your answer is technically complete.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <span>Getting rejected by companies without ever finding out where your gaps or missing concepts were.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <span>Freezing up when an interviewer asks unexpected follow-up questions.</span>
              </li>
            </ul>
          </div>

          {/* InterviewIQ Way */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-base">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>The InterviewIQ Way (AI Simulation)</span>
            </div>
            <ul className="space-y-3 text-xs text-navy-700 dark:text-navy-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Speak with a simulated AI interviewer using <strong>browser Speech-to-Text</strong> to eliminate verbal hesitation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Receive instant scores across <strong>5 parameters</strong> (Technical 30%, Relevance 25%, Comm 20%, Completeness 15%, Problem Solving 10%).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>AI asks <strong>adaptive follow-up questions</strong> if your answer is too brief or misses edge cases.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>Get a <strong>Personalized Learning Roadmap</strong> with direct links to LeetCode and System Design guides.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. How It Works (Simplified 4-Step Cards) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Simple 4-Step Flow
          </span>
          <h2 className="text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            How Your Mock Interview Works
          </h2>
          <p className="text-sm text-navy-500 dark:text-navy-400">
            From setup to complete evaluation in less than 20 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Pick Role & Level',
              desc: 'Select Software Dev, Frontend, Backend, AI/ML, or HR. Choose Beginner, Intermediate, or FAANG-level difficulty.',
              icon: Target,
            },
            {
              step: '02',
              title: 'Upload Resume (Optional)',
              desc: 'Optionally upload your resume. The AI will extract your projects and ask questions matching your actual background.',
              icon: FileCheck,
            },
            {
              step: '03',
              title: 'Speak or Type Answer',
              desc: 'Click the mic button to speak naturally. The AI recites questions out loud and intervenes with dynamic follow-ups.',
              icon: Mic,
            },
            {
              step: '04',
              title: 'Detailed Report & PDF',
              desc: 'Review scores, missing concepts, model answers, and click 1 button to download a printable PDF report card.',
              icon: Award,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <span className="text-3xl font-black text-navy-100 dark:text-navy-750 absolute top-4 right-5 select-none">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-navy-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-navy-600 dark:text-navy-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Frequently Asked Questions (FAQ Accordion for First-Time Users) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-navy-500">
            Everything you need to know before taking your first practice session.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
                >
                  <span className="font-bold text-sm text-navy-900 dark:text-white">
                    {faq.q}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-navy-50 dark:bg-navy-800 flex items-center justify-center text-navy-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-navy-600 dark:text-navy-300 leading-relaxed border-t border-navy-50 dark:border-navy-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Call to Action CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-brand-600 via-royal-600 to-violet-600 text-white shadow-2xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Your First Mock Interview?
          </h2>
          <p className="text-sm sm:text-base text-brand-100 max-w-xl mx-auto leading-relaxed">
            Practice for your dream role right now. It takes just 1 click to start, completely free with no credit card required.
          </p>
          <div className="pt-2">
            <Link
              href="/interview/setup"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-brand-700 font-extrabold text-sm shadow-xl hover:bg-brand-50 hover:scale-105 transition-all"
            >
              <PlayCircle className="w-5 h-5 text-brand-600" />
              <span>Launch Mock Interview Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
