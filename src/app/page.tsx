'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Mic,
  Lightbulb,
  CheckCircle2,
  XCircle,
  FileText,
  Sliders,
  Award,
  Terminal,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  const [activeDemoRole, setActiveDemoRole] = useState<'fs' | 'fe' | 'ai' | 'hr'>('fs');
  const [demoUserAnswer, setDemoUserAnswer] = useState(
    'React uses a Virtual DOM tree. When state changes, reconciliation computes an O(n) diff to update real DOM nodes efficiently. React 18 Fiber introduces time-slicing so urgent user input can interrupt background rendering.'
  );
  const [showDemoEvaluation, setShowDemoEvaluation] = useState(false);
  const [isEvaluatingDemo, setIsEvaluatingDemo] = useState(false);

  // Fold state for the Enfold-style interactive card demo
  const [openFold, setOpenFold] = useState<'question' | 'answer' | 'evaluation' | 'model'>('evaluation');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sampleDemoQuestions = {
    fs: {
      role: 'Full Stack Developer',
      question: 'How does React’s Virtual DOM and Reconciliation algorithm work, and how does the React 18 Fiber architecture enable concurrent rendering?',
      category: 'React Internals',
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
      category: 'Performance',
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
      category: 'STAR Behavioral',
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
      setOpenFold('evaluation');
    }, 600);
  };

  const currentDemo = sampleDemoQuestions[activeDemoRole];

  const faqs = [
    {
      q: 'Is InterviewIQ really free to use?',
      a: 'Yes, completely free. You can conduct technical and behavioral mock sessions, test speech input, and export scorecards without sign-up or credit card.',
    },
    {
      q: 'Do I have to speak, or can I type answers?',
      a: 'Both are supported. Use speech-to-text to practice realistic verbal delivery, or type directly in the editor if you prefer coding syntax and concise notes.',
    },
    {
      q: 'Does it work for college freshers with zero industry experience?',
      a: 'Yes. In the setup screen, choose Beginner or Intermediate difficulty with roles like Software Developer or HR to calibrate questions for campus placements.',
    },
    {
      q: 'How does resume parsing work?',
      a: 'Upload a resume file (.pdf, .txt, .md) or paste text. InterviewIQ extracts key projects, languages, and tools to tailor questions directly to your actual achievements.',
    },
    {
      q: 'Where is my interview history stored?',
      a: 'All candidate profiles, interview transcripts, scores, and practice roadmaps persist locally on your computer in a lightweight database file.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section (Enfold Editorial Opening) */}
      <section className="pt-16 sm:pt-24 pb-8 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
        <div>
          <span className="inline-block text-[11px] font-mono tracking-widest text-[var(--accent)] uppercase font-semibold mb-3">
            InterviewIQ • Calm Practice System
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[var(--text)] leading-[1.06]">
            Every technical interview, <br className="hidden sm:inline" />
            <em className="text-[var(--accent)] font-normal italic">neatly mastered.</em>
          </h1>
        </div>

        <p className="text-base sm:text-lg text-[var(--text-soft)] max-w-2xl mx-auto leading-relaxed">
          Open only what you need. Prepare for software engineering, system architecture, and campus behavioral interviews in one calm place—folded into focused sections with real-time rubric feedback.
        </p>

        {/* Action Buttons (Enfold Pill Style) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/interview/setup" prefetch={true} className="btn-enfold">
            <span>Start mock session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link href="/dashboard" prefetch={true} className="btn-enfold-ghost">
            <span>Open dashboard</span>
          </Link>
        </div>

        <p className="text-xs text-[var(--text-muted)] font-mono pt-1">
          Free. No sign-in required. In your browser and on your machine.
        </p>
      </section>

      {/* 2. The Foldable Card Demo (The Enfold Experience) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--rule)]">
          <div>
            <span className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-wider font-semibold">
              The Interactive Fold
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text)]">
              Questions, answers, and rubrics, <em>folded into one calm card.</em>
            </h2>
          </div>

          {/* Discipline selector pills */}
          <div className="flex flex-wrap gap-1">
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
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  activeDemoRole === tab.id
                    ? 'bg-[var(--text)] text-[var(--bg)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--active-bg)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Enfold Tactile Paper Card */}
        <div className="paper p-6 sm:p-8 space-y-5">
          {/* Fold 1: The Question */}
          <div className="border border-[var(--rule)] rounded-xl overflow-hidden bg-[var(--paper)]">
            <button
              type="button"
              onClick={() => setOpenFold(openFold === 'question' ? 'answer' : 'question')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--active-bg)] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--rule)] text-[var(--text)] flex items-center justify-center font-mono text-[10px]">
                  01
                </span>
                <span className="font-editorial text-sm font-semibold text-[var(--text)]">
                  The Question • <span className="text-[var(--text-muted)] font-sans font-normal text-xs">{currentDemo.category}</span>
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${openFold === 'question' ? 'rotate-180' : ''}`} />
            </button>
            {openFold === 'question' && (
              <div className="px-4 pb-4 pt-1 text-xs text-[var(--text-soft)] leading-relaxed border-t border-[var(--rule)]">
                <p className="font-editorial text-sm text-[var(--text)] leading-snug">
                  "{currentDemo.question}"
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                  <span>Target: {currentDemo.role}</span>
                  <span>•</span>
                  <span>Evaluated against FAANG hiring bar</span>
                </div>
              </div>
            )}
          </div>

          {/* Fold 2: Candidate Spoken Answer */}
          <div className="border border-[var(--rule)] rounded-xl overflow-hidden bg-[var(--paper)]">
            <button
              type="button"
              onClick={() => setOpenFold(openFold === 'answer' ? 'evaluation' : 'answer')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--active-bg)] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--rule)] text-[var(--text)] flex items-center justify-center font-mono text-[10px]">
                  02
                </span>
                <span className="font-editorial text-sm font-semibold text-[var(--text)]">
                  Candidate Response & Audio Transcript
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${openFold === 'answer' ? 'rotate-180' : ''}`} />
            </button>
            {openFold === 'answer' && (
              <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[var(--rule)]">
                <textarea
                  value={demoUserAnswer}
                  onChange={(e) => setDemoUserAnswer(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--text)] font-sans leading-relaxed focus:outline-none focus:border-[var(--accent)]"
                />
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Mic className="w-3.5 h-3.5 text-[var(--accent)]" />
                    Browser Speech-to-Text active
                  </span>
                  <button
                    type="button"
                    onClick={handleTestDemoEvaluation}
                    disabled={isEvaluatingDemo}
                    className="btn-enfold py-1 px-3 text-xs"
                  >
                    {isEvaluatingDemo ? 'Evaluating...' : 'Run Rubric Check'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fold 3: 5-Parameter AI Rubric Breakdown */}
          <div className="border border-[var(--rule)] rounded-xl overflow-hidden bg-[var(--paper)]">
            <button
              type="button"
              onClick={() => setOpenFold(openFold === 'evaluation' ? 'model' : 'evaluation')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--active-bg)] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-mono text-[10px]">
                  03
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-editorial text-sm font-semibold text-[var(--text)]">
                    The 5-Dimension Rubric Score
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--accent)] tabular-nums">
                    {currentDemo.score}%
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${openFold === 'evaluation' ? 'rotate-180' : ''}`} />
            </button>
            {openFold === 'evaluation' && (
              <div className="px-4 pb-4 pt-2 space-y-3 border-t border-[var(--rule)]">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { label: 'Technical', weight: '30%', val: currentDemo.tech },
                    { label: 'Relevance', weight: '25%', val: currentDemo.relevance },
                    { label: 'Communication', weight: '20%', val: currentDemo.comm },
                    { label: 'Completeness', weight: '15%', val: currentDemo.comp },
                    { label: 'Problem-Solving', weight: '10%', val: currentDemo.ps },
                  ].map((dim, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--rule)] text-center">
                      <span className="text-[10px] text-[var(--text-muted)] block font-mono">{dim.label}</span>
                      <span className="text-xs font-semibold text-[var(--text)] tabular-nums mt-0.5 block">
                        {dim.val}%
                      </span>
                      <span className="text-[9px] text-[var(--text-soft)] block font-mono">{dim.weight}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--text-soft)] leading-relaxed">
                  <strong>Assessment verdict:</strong> Solid architectural accuracy. Explained Fiber scheduling clearly; missed explicit pointer structure (child, sibling, return).
                </p>
              </div>
            )}
          </div>

          {/* Fold 4: Model Solution */}
          <div className="border border-[var(--rule)] rounded-xl overflow-hidden bg-[var(--paper)]">
            <button
              type="button"
              onClick={() => setOpenFold(openFold === 'model' ? 'question' : 'model')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--active-bg)] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[var(--rule)] text-[var(--text)] flex items-center justify-center font-mono text-[10px]">
                  04
                </span>
                <span className="font-editorial text-sm font-semibold text-[var(--text)]">
                  Exemplary Model Answer Suggestion
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${openFold === 'model' ? 'rotate-180' : ''}`} />
            </button>
            {openFold === 'model' && (
              <div className="px-4 pb-4 pt-2 border-t border-[var(--rule)] text-xs text-[var(--text-soft)] leading-relaxed space-y-2">
                <p className="font-serif italic text-xs leading-relaxed text-[var(--text)]">
                  "{currentDemo.modelAnswer}"
                </p>
                <div className="pt-1 text-right">
                  <Link href="/interview/setup" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline">
                    <span>Configure full 5-question mock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Tactile Keyboard Shortcuts Strip (Enfold Touch) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="paper p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="text-xs font-editorial font-semibold text-[var(--text)]">
              Tactile session controls
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Keep your hands on the keyboard during mock interviews.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--text-soft)]">
            <div className="flex items-center gap-1.5">
              <kbd>Space</kbd>
              <span className="text-[11px]">Record</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd>Enter</kbd>
              <span className="text-[11px]">Submit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd>Esc</kbd>
              <span className="text-[11px]">Pause</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Mess vs The Folded System */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-mono text-[var(--accent)] uppercase font-semibold">
            The Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text)]">
            The scattered mess vs. <em>the calm system.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="paper p-6 space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>The Scattered Mess</span>
            </div>
            <ul className="space-y-2 text-xs text-[var(--text-soft)]">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] mt-1.5 shrink-0"></span>
                <span>Twenty open tabs with random LeetCode solutions and uncalibrated answers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] mt-1.5 shrink-0"></span>
                <span>Practicing silently in your head without testing whether your vocal explanation flows cohesively.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] mt-1.5 shrink-0"></span>
                <span>Zero insight into whether technical concepts were missed or if the solution is incomplete.</span>
              </li>
            </ul>
          </div>

          <div className="paper p-6 space-y-3">
            <div className="flex items-center gap-2 text-[var(--accent)] font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>The Folded InterviewIQ Way</span>
            </div>
            <ul className="space-y-2 text-xs text-[var(--text-soft)]">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)] mt-1.5 shrink-0"></span>
                <span>Vocal dialogue with real-time Speech-to-Text and dynamic follow-up probes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)] mt-1.5 shrink-0"></span>
                <span>Strict 5-parameter rubric scoring with exact missing concept identification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)] mt-1.5 shrink-0"></span>
                <span>Personalized roadmap recommendations and 1-click printable PDF scorecards.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Common Questions (Calm Accordion) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-mono text-[var(--accent)] uppercase font-semibold">
            Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text)]">
            Frequently asked questions
          </h2>
        </div>

        <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-1 flex items-center justify-between text-left gap-4 text-xs font-semibold text-[var(--text)]"
                >
                  <span className="font-editorial text-sm">{faq.q}</span>
                  <div className="text-[var(--text-muted)] shrink-0">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>
                {isOpen && (
                  <p className="pt-2 text-xs text-[var(--text-soft)] leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Closing Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="paper p-8 text-center space-y-4">
          <h3 className="font-editorial text-2xl font-semibold text-[var(--text)]">
            Ready to fold away interview uncertainty?
          </h3>
          <p className="text-xs text-[var(--text-soft)] max-w-md mx-auto leading-relaxed">
            Configure your target role, difficulty, and question count to launch a complete mock session now.
          </p>
          <div className="pt-2">
            <Link href="/interview/setup" className="btn-enfold">
              <span>Configure mock session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
