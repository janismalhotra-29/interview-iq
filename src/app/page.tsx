'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Clock,
  Layers,
  Terminal,
  ArrowRight,
  Maximize2,
  Video,
  VideoOff,
  Cpu,
  Shield,
  Eye,
  Sliders,
} from 'lucide-react';

export default function LandingPage() {
  // Active Chapter for Left Spine Navigation
  const [activeChapter, setActiveChapter] = useState<'start' | 'mess' | 'fold' | 'inside' | 'keys' | 'cockpit'>('start');

  // The Mess vs Fold toggle state
  const [isMessFolded, setIsMessFolded] = useState(false);

  // 4-Fold Card State
  const [openFolds, setOpenFolds] = useState<Record<string, boolean>>({
    question: true,
    answer: true,
    rubric: true,
    model: false,
  });

  // Demo Question & Answer State
  const [currentRole, setCurrentRole] = useState<'fs' | 'sys' | 'be'>('fs');
  const [answerText, setAnswerText] = useState(
    'React maintains an in-memory Virtual DOM tree. When state changes, reconciliation computes an O(n) diff using heuristics to update the actual DOM. In React 18, the Fiber architecture splits work into interruptible units, allowing urgent user interactions to take priority over background rendering.'
  );

  // Live Microphone / Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // AI Scoring State
  const [isGrading, setIsGrading] = useState(false);
  const [hasGraded, setHasGraded] = useState(false);

  // Blue Cockpit Modal State ("when i click on blue coulour interfaces comeee")
  const [isCockpitOpen, setIsCockpitOpen] = useState(false);
  const [cockpitVideoActive, setCockpitVideoActive] = useState(true);
  const [cockpitTimer, setCockpitTimer] = useState(1182); // 19:42
  const [activeCockpitTab, setActiveCockpitTab] = useState<'answer' | 'rubric' | 'terminal'>('answer');

  // Mechanical Keyboard Active Key State
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Audio Click Sound Synthesizer (Web Audio API)
  const playKeyClick = (pitch = 400) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // AudioContext not allowed before user gesture
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in a textarea or input
      if (['TEXTAREA', 'INPUT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();
      setPressedKey(key);
      playKeyClick(520);

      if (e.code === 'Space') {
        e.preventDefault();
        toggleSpeechRecognition();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        runGradingDemo();
      } else if (e.key === '1') {
        toggleFold('question');
      } else if (e.key === '2') {
        toggleFold('answer');
      } else if (e.key === '3') {
        toggleFold('rubric');
      } else if (e.key === '4') {
        toggleFold('model');
      } else if (e.key === 'Escape') {
        setIsCockpitOpen(false);
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isListening, openFolds]);

  // Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (text) setAnswerText(text);
        };
        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);
        recognitionRef.current = rec;
      } else {
        setSpeechSupported(false);
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type directly.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const speakQuestion = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      'How does React Virtual DOM and Reconciliation algorithm work, and how does the React 18 Fiber architecture enable concurrent rendering?'
    );
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleFold = (foldKey: string) => {
    setOpenFolds((prev) => ({ ...prev, [foldKey]: !prev[foldKey] }));
    playKeyClick(440);
  };

  const runGradingDemo = () => {
    setIsGrading(true);
    setHasGraded(false);
    playKeyClick(600);
    setTimeout(() => {
      setIsGrading(false);
      setHasGraded(true);
      setOpenFolds((prev) => ({ ...prev, rubric: true }));
    }, 700);
  };

  // Cockpit Timer Countdown
  useEffect(() => {
    if (!isCockpitOpen) return;
    const interval = setInterval(() => {
      setCockpitTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCockpitOpen]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-[var(--text)]">
      {/* ── Left Chapter Spine Navigation ── */}
      <nav className="spine-nav" aria-label="Chapters">
        <div className="spine-line" />
        <button
          onClick={() => { setActiveChapter('start'); scrollToSection('sc-start'); }}
          className={`spine-dot ${activeChapter === 'start' ? 'active' : ''}`}
          title="Start"
        />
        <button
          onClick={() => { setActiveChapter('mess'); scrollToSection('sc-mess'); }}
          className={`spine-dot ${activeChapter === 'mess' ? 'active' : ''}`}
          title="The Mess"
        />
        <button
          onClick={() => { setActiveChapter('fold'); scrollToSection('sc-fold'); }}
          className={`spine-dot ${activeChapter === 'fold' ? 'active' : ''}`}
          title="A Fold"
        />
        <button
          onClick={() => { setActiveChapter('inside'); scrollToSection('sc-inside'); }}
          className={`spine-dot ${activeChapter === 'inside' ? 'active' : ''}`}
          title="Inside"
        />
        <button
          onClick={() => { setActiveChapter('keys'); scrollToSection('sc-keys'); }}
          className={`spine-dot ${activeChapter === 'keys' ? 'active' : ''}`}
          title="Keyboard First"
        />
        <button
          onClick={() => { setIsCockpitOpen(true); }}
          className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-400 animate-pulse"
          title="Open Blue Studio Cockpit"
        />
      </nav>

      {/* ── 1. Hero / Start Section ── */}
      <section id="sc-start" className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent)]/20 mx-auto">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
          <span>InterviewIQ · Technical &amp; HR Mock Simulator</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[var(--text)] leading-[1.08] max-w-4xl mx-auto">
          Everything you know, <br />
          <em>neatly folded.</em>
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-soft)] max-w-2xl mx-auto leading-relaxed">
          Open only what you need. InterviewIQ keeps your technical questions, voice recordings, 5-parameter rubric scores, and verified model answers tucked into calm sections you open when you want them.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Blue Colour Interface Button */}
          <button
            onClick={() => setIsCockpitOpen(true)}
            className="cockpit-neon-btn px-6 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Launch Blue Studio Cockpit</span>
          </button>

          <Link
            href="/interview/demo"
            className="btn-enfold px-6 py-3 text-xs sm:text-sm flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Live Mock Session</span>
          </Link>

          <button
            onClick={() => scrollToSection('sc-fold')}
            className="btn-enfold-ghost px-5 py-3 text-xs sm:text-sm"
          >
            <span>Explore Structure</span>
            <span className="text-[var(--accent)]">↓</span>
          </button>
        </div>

        <p className="text-xs text-[var(--text-muted)] font-mono">
          Free · No sign-in required · Voice synthesis &amp; Speech recognition ready
        </p>
      </section>

      {/* ── 2. The Mess vs The Fold Section ── */}
      <section id="sc-mess" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--rule)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
              The Problem
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[var(--text)] font-semibold leading-tight">
              Prep notes grow. <br />
              <em>Then they get messy.</em>
            </h2>
            <p className="text-sm text-[var(--text-soft)] leading-relaxed">
              One chaotic document where dozens of technical concepts, past questions, voice transcripts, and missing points are open at once. The key insight you need right before an interview is buried in the clutter.
            </p>
            <div className="pt-2">
              <button
                onClick={() => { setIsMessFolded(!isMessFolded); playKeyClick(480); }}
                className="btn-enfold-ghost text-xs px-4 py-2 inline-flex items-center gap-2"
              >
                <span>{isMessFolded ? 'Unfold the messy notes' : 'Fold it into one calm card'}</span>
                <span className="cv" style={{ transform: isMessFolded ? 'rotate(45deg)' : 'rotate(-45deg)' }} />
              </button>
            </div>
          </div>

          {/* Interactive Mess / Fold Card */}
          <div className="paper p-6 rounded-2xl relative overflow-hidden transition-all duration-500 min-h-[220px] flex flex-col justify-center">
            {isMessFolded ? (
              <div className="space-y-3 py-4 text-center animate-fadeIn">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent)] px-3 py-1 rounded-full bg-[var(--accent-subtle)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Section 01: Full Stack Architecture (Tucked Away)</span>
                </div>
                <h3 className="font-editorial text-xl text-[var(--text)] font-medium">
                  120 words neatly compressed.
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Only the header stays. Details unpack with a single click.
                </p>
              </div>
            ) : (
              <div className="space-y-2 opacity-80 select-none">
                <div className="text-[11px] font-mono text-[var(--text-muted)] flex justify-between">
                  <span>UNSTRUCTURED REVISION DUMP</span>
                  <span className="text-rose-500 font-bold">120 words and counting</span>
                </div>
                <p className="text-xs text-[var(--text-soft)] blur-[0.6px] leading-relaxed line-clamp-4">
                  React reconciliation tree diffing algorithm O(n) heuristic vs fiber node workInProgress current alternate child sibling return memoizedProps memoizedState lane priority scheduler requestIdleCallback starvation edge cases batching synthetic events delegation portal hydration mismatch...
                </p>
                <div className="h-10 bg-gradient-to-t from-[var(--paper)] to-transparent pointer-events-none" />
                <p className="text-[11px] font-mono text-[var(--accent)] text-center">
                  ↑ Overwhelming &amp; unorganized
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. The Idea: Interactive 4-Fold Section ── */}
      <section id="sc-fold" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--rule)] space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
            The Idea
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[var(--text)] font-semibold">
            A fold is a section <em>you can close.</em>
          </h2>
          <p className="text-sm text-[var(--text-soft)]">
            Interact with this live session fold below. Use real speech recognition, audio synthesis, and live AI scoring right now.
          </p>
        </div>

        {/* Live Interactive Paper Fold Card */}
        <div className="paper rounded-2xl overflow-hidden divide-y divide-[var(--rule)] shadow-lg">
          {/* FOLD 1: The Question */}
          <div>
            <button
              onClick={() => toggleFold('question')}
              className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[var(--active-bg)] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`cv ${openFolds.question ? 'open' : ''}`} />
                <span className="font-editorial text-base sm:text-lg text-[var(--text)] font-medium">
                  Section 01 · Question: React Virtual DOM &amp; Fiber
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                  Hard
                </span>
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {openFolds.question ? 'Close Fold' : 'Open Fold'}
              </span>
            </button>

            {openFolds.question && (
              <div className="p-5 sm:p-6 bg-[var(--bg)]/50 space-y-4 border-t border-[var(--rule)]">
                <p className="font-editorial text-lg text-[var(--text)] leading-relaxed">
                  "How does React’s Virtual DOM and Reconciliation algorithm work, and how does the React 18 Fiber architecture enable concurrent rendering?"
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={speakQuestion}
                    className="btn-enfold-ghost text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Listen Aloud (SpeechSynthesis)</span>
                  </button>
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    Expected: Virtual DOM, Reconciliation, Fiber Node, Time-Slicing
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* FOLD 2: Voice & Real-Time Answer */}
          <div>
            <button
              onClick={() => toggleFold('answer')}
              className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[var(--active-bg)] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`cv ${openFolds.answer ? 'open' : ''}`} />
                <span className="font-editorial text-base sm:text-lg text-[var(--text)] font-medium">
                  Section 02 · Candidate Voice &amp; Transcript
                </span>
                {isListening && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 animate-pulse">
                    ● Recording
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {openFolds.answer ? 'Close Fold' : 'Open Fold'}
              </span>
            </button>

            {openFolds.answer && (
              <div className="p-5 sm:p-6 bg-[var(--bg)]/50 space-y-4 border-t border-[var(--rule)]">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-[var(--text-muted)]">
                      Your Technical Answer (Type or Speak Aloud):
                    </label>
                    <button
                      onClick={toggleSpeechRecognition}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-[var(--paper)] text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent-subtle)]'
                      }`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isListening ? 'Stop Mic (Space)' : 'Start Voice Mic (Space)'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--rule)] text-xs sm:text-sm text-[var(--text)] leading-relaxed focus:outline-none focus:border-[var(--accent)]"
                    placeholder="Provide your technical answer here or speak using the microphone..."
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] font-mono text-[var(--text-muted)]">
                    Press <kbd>Space</kbd> to record, <kbd>Enter</kbd> to evaluate.
                  </div>

                  <button
                    onClick={runGradingDemo}
                    disabled={isGrading}
                    className="btn-enfold text-xs px-4 py-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGrading ? 'AI Evaluating...' : 'Score My Answer (Enter)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FOLD 3: 5-Parameter AI Rubric */}
          <div>
            <button
              onClick={() => toggleFold('rubric')}
              className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[var(--active-bg)] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`cv ${openFolds.rubric ? 'open' : ''}`} />
                <span className="font-editorial text-base sm:text-lg text-[var(--text)] font-medium">
                  Section 03 · 5-Parameter AI Academic Evaluation
                </span>
                <span className="font-editorial text-sm font-semibold text-[var(--accent)]">
                  88.6% Total
                </span>
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {openFolds.rubric ? 'Close Section' : 'Open Section'}
              </span>
            </button>

            {openFolds.rubric && (
              <div className="p-5 sm:p-6 bg-[var(--bg)]/50 space-y-4 border-t border-[var(--rule)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="paper p-3 rounded-xl">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">1. Technical (30%)</span>
                    <span className="font-editorial text-xl font-semibold text-[var(--text)]">92%</span>
                    <div className="w-full h-1.5 rounded-full bg-[var(--rule)] mt-1.5 overflow-hidden">
                      <div className="h-full bg-[var(--accent)]" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div className="paper p-3 rounded-xl">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">2. Relevance (25%)</span>
                    <span className="font-editorial text-xl font-semibold text-[var(--text)]">90%</span>
                    <div className="w-full h-1.5 rounded-full bg-[var(--rule)] mt-1.5 overflow-hidden">
                      <div className="h-full bg-[var(--accent)]" style={{ width: '90%' }} />
                    </div>
                  </div>

                  <div className="paper p-3 rounded-xl">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">3. Communication (20%)</span>
                    <span className="font-editorial text-xl font-semibold text-[var(--text)]">86%</span>
                    <div className="w-full h-1.5 rounded-full bg-[var(--rule)] mt-1.5 overflow-hidden">
                      <div className="h-full bg-[var(--accent)]" style={{ width: '86%' }} />
                    </div>
                  </div>

                  <div className="paper p-3 rounded-xl">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">4. Completeness (15%)</span>
                    <span className="font-editorial text-xl font-semibold text-[var(--text)]">84%</span>
                    <div className="w-full h-1.5 rounded-full bg-[var(--rule)] mt-1.5 overflow-hidden">
                      <div className="h-full bg-[var(--accent)]" style={{ width: '84%' }} />
                    </div>
                  </div>

                  <div className="paper p-3 rounded-xl">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">5. Problem Solving (10%)</span>
                    <span className="font-editorial text-xl font-semibold text-[var(--text)]">88%</span>
                    <div className="w-full h-1.5 rounded-full bg-[var(--rule)] mt-1.5 overflow-hidden">
                      <div className="h-full bg-[var(--accent)]" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>

                <div className="paper p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-mono text-[var(--accent)]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Diagnostic Summary:</span>
                  </div>
                  <p className="text-[var(--text-soft)] leading-relaxed">
                    Strong explanation of Fiber time-slicing and reconciliation heuristics. To score 98%+, explicitly contrast cooperative multitasking with preemption, and mention <code className="bg-[var(--active-bg)] px-1 py-0.5 rounded">requestIdleCallback</code> vs React's internal scheduler.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* FOLD 4: Verified Model Answer */}
          <div>
            <button
              onClick={() => toggleFold('model')}
              className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-[var(--active-bg)] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`cv ${openFolds.model ? 'open' : ''}`} />
                <span className="font-editorial text-base sm:text-lg text-[var(--text)] font-medium">
                  Section 04 · Verified Model Answer
                </span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Exemplary
                </span>
              </div>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {openFolds.model ? 'Close Section' : 'Open Section'}
              </span>
            </button>

            {openFolds.model && (
              <div className="p-5 sm:p-6 bg-[var(--bg)]/50 space-y-3 border-t border-[var(--rule)] text-xs sm:text-sm text-[var(--text-soft)] leading-relaxed">
                <p>
                  <strong className="text-[var(--text)]">1. Virtual DOM &amp; Reconciliation:</strong> React maintains an in-memory representation of the DOM. When state changes occur, React performs reconciliation using an O(n) heuristic: assuming elements of different types generate different trees, and keys identify stable items across re-renders.
                </p>
                <p>
                  <strong className="text-[var(--text)]">2. React 18 Fiber:</strong> Fiber reimplements the reconciler by transforming the call stack into a singly linked list of units of work (fibers). Each fiber represents a component with <code className="bg-[var(--active-bg)] px-1 py-0.5 rounded">child</code>, <code className="bg-[var(--active-bg)] px-1 py-0.5 rounded">sibling</code>, and <code className="bg-[var(--active-bg)] px-1 py-0.5 rounded">return</code> pointers. This enables concurrent rendering where the main thread can yield to high-priority events (e.g. typing) via <code className="bg-[var(--active-bg)] px-1 py-0.5 rounded">useTransition</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. Folds Inside Folds Section ── */}
      <section id="sc-inside" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--rule)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
              Folds Inside Folds
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[var(--text)] font-semibold leading-tight">
              Put folds <br />
              <em>inside folds.</em>
            </h2>
            <p className="text-sm text-[var(--text-soft)] leading-relaxed">
              An interview has questions. A question has sub-points. A sub-point has trade-offs and latency benchmarks. Go as deep as you need, and fold right back up in one keystroke.
            </p>
          </div>

          <div className="paper p-6 rounded-2xl space-y-3 font-mono text-xs">
            <div className="text-[11px] text-[var(--text-muted)] pb-2 border-b border-[var(--rule)] flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>NESTED ARCHITECTURE DRILL-DOWN</span>
            </div>

            <div className="pl-2 border-l-2 border-[var(--rule)] space-y-2">
              <div className="text-[var(--text)] font-semibold flex items-center gap-1.5">
                <span className="text-[var(--accent)]">▾</span> 1. System Design: Distributed URL Shortener
              </div>

              <div className="pl-4 border-l border-[var(--rule)] space-y-1.5 text-[var(--text-soft)]">
                <div>▸ 1.1 Capacity Estimation (10k writes/sec)</div>
                <div className="text-[var(--text)] font-medium">▾ 1.2 Storage &amp; Database Layer</div>

                <div className="pl-4 border-l border-[var(--rule)] space-y-1 text-[var(--text-muted)]">
                  <div>▸ 1.2.1 NoSQL vs Relational Schema</div>
                  <div className="text-[var(--accent)] font-semibold">▸ 1.2.2 Base62 Hash Encoding vs Range Counters</div>
                </div>

                <div>▸ 1.3 Redis In-Memory Cache Invalidation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Keyboard First: Interactive Mechanical Keyboard Simulator ── */}
      <section id="sc-keys" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--rule)] space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
            Keyboard First
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[var(--text)] font-semibold">
            Your hands never leave <em>the keyboard.</em>
          </h2>
          <p className="text-sm text-[var(--text-soft)]">
            Speak, score, switch folds, and advance mock sessions without touching your mouse. Click any key below or press keys on your physical keyboard to test the interactive simulation.
          </p>
        </div>

        {/* The Animated Mechanical Keyboard */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="kb">
            {/* Row 1: Numbers */}
            <div className="kr">
              {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'DEL'].map((k) => (
                <div
                  key={k}
                  onClick={() => {
                    setPressedKey(k);
                    playKeyClick(400);
                    if (['1', '2', '3', '4'].includes(k)) {
                      const mapping: any = { '1': 'question', '2': 'answer', '3': 'rubric', '4': 'model' };
                      toggleFold(mapping[k]);
                    }
                  }}
                  className={`k ${pressedKey === k ? 'down' : ''}`}
                >
                  {k}
                </div>
              ))}
            </div>

            {/* Row 2: QWERTY */}
            <div className="kr">
              {['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'].map((k) => (
                <div
                  key={k}
                  onClick={() => { setPressedKey(k); playKeyClick(420); }}
                  className={`k ${pressedKey === k ? 'down' : ''}`}
                >
                  {k}
                </div>
              ))}
            </div>

            {/* Row 3: ASDF */}
            <div className="kr">
              {['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', 'ENTER'].map((k) => (
                <div
                  key={k}
                  onClick={() => {
                    setPressedKey(k);
                    playKeyClick(k === 'ENTER' ? 600 : 440);
                    if (k === 'ENTER') runGradingDemo();
                  }}
                  className={`k ${k === 'ENTER' ? 'px-4 text-[var(--accent)] font-bold' : ''} ${
                    pressedKey === k ? 'down' : ''
                  }`}
                >
                  {k}
                </div>
              ))}
            </div>

            {/* Row 4: Spacebar */}
            <div className="kr">
              <div
                onClick={() => { setPressedKey('SHIFT'); playKeyClick(460); }}
                className={`k flex-1 ${pressedKey === 'SHIFT' ? 'down' : ''}`}
              >
                SHIFT
              </div>
              <div
                onClick={() => {
                  setPressedKey('SPACE');
                  playKeyClick(350);
                  toggleSpeechRecognition();
                }}
                className={`k flex-[4] text-center font-mono ${
                  pressedKey === ' ' || pressedKey === 'SPACE' ? 'down' : ''
                }`}
              >
                SPACE (Voice Record / Stop)
              </div>
              <div
                onClick={() => { setPressedKey('ESC'); playKeyClick(480); setIsCockpitOpen(false); }}
                className={`k flex-1 ${pressedKey === 'ESC' ? 'down' : ''}`}
              >
                ESC
              </div>
            </div>
          </div>

          {/* Quick Shortcuts List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono text-[var(--text-muted)]">
            <div className="paper p-2.5 rounded-xl">
              <kbd className="mr-1">Space</kbd> Voice Record
            </div>
            <div className="paper p-2.5 rounded-xl">
              <kbd className="mr-1">Enter</kbd> Grade Answer
            </div>
            <div className="paper p-2.5 rounded-xl">
              <kbd className="mr-1">1 - 4</kbd> Switch Folds
            </div>
            <div className="paper p-2.5 rounded-xl">
              <kbd className="mr-1">Esc</kbd> Close Overlay
            </div>
          </div>
        </div>
      </section>

      {/* ── 5b. Horizontal Domain Tracks (Sideways Carousel) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--rule)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
              Multi-Discipline Support
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[var(--text)] font-semibold mt-1">
              One simple structure. <em>Endless technical disciplines.</em>
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono">
            Scroll horizontally to explore tracks →
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar">
          <div className="min-w-[280px] sm:min-w-[320px] paper p-6 rounded-2xl snap-start space-y-3 hover:border-[var(--accent)]/40 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded-full border border-[var(--accent)]/20">
              Track 01
            </span>
            <h3 className="font-editorial text-xl text-[var(--text)] font-medium">
              Frontend &amp; Web Performance
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              React 18 Fiber architecture, time-slicing with useTransition, SSR hydration mismatch, and Core Web Vitals (LCP, INP, CLS).
            </p>
            <div className="pt-2 text-[11px] font-mono text-[var(--accent)] flex items-center gap-1">
              <span>Explore rubric breakdown</span> →
            </div>
          </div>

          <div className="min-w-[280px] sm:min-w-[320px] paper p-6 rounded-2xl snap-start space-y-3 hover:border-[var(--accent)]/40 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded-full border border-[var(--accent)]/20">
              Track 02
            </span>
            <h3 className="font-editorial text-xl text-[var(--text)] font-medium">
              Distributed Systems
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Raft consensus, Kafka log partitioning, 2PC vs Saga transactions, CAP theorem tradeoffs, and idempotent API retries.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[var(--accent)] flex items-center gap-1">
              <span>Explore rubric breakdown</span> →
            </div>
          </div>

          <div className="min-w-[280px] sm:min-w-[320px] paper p-6 rounded-2xl snap-start space-y-3 hover:border-[var(--accent)]/40 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded-full border border-[var(--accent)]/20">
              Track 03
            </span>
            <h3 className="font-editorial text-xl text-[var(--text)] font-medium">
              High-Scale Database &amp; Cache
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              B-tree vs LSM-tree storage engines, Redis cluster cache invalidation patterns, read replication lag, and distributed locks.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[var(--accent)] flex items-center gap-1">
              <span>Explore rubric breakdown</span> →
            </div>
          </div>

          <div className="min-w-[280px] sm:min-w-[320px] paper p-6 rounded-2xl snap-start space-y-3 hover:border-[var(--accent)]/40 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded-full border border-[var(--accent)]/20">
              Track 04
            </span>
            <h3 className="font-editorial text-xl text-[var(--text)] font-medium">
              Behavioral &amp; Leadership
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              STAR framework situational storytelling, resolving high-friction technical disagreements, and leading post-mortem blameless RCAs.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[var(--accent)] flex items-center gap-1">
              <span>Explore rubric breakdown</span> →
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Blue Cockpit Launcher Callout Banner ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="cockpit-card rounded-3xl p-8 sm:p-10 relative overflow-hidden text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-500/30">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Blue Studio Cockpit</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-semibold">
            Ready for the real technical mock interview?
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Experience the full high-tech blue studio interface with webcam face tracking, live audio visualizer waveform, question countdown timer, code editor, and instant AI grading.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsCockpitOpen(true)}
              className="cockpit-neon-btn px-8 py-3.5 rounded-full text-sm font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Launch Blue Studio Interface</span>
            </button>

            <Link
              href="/interview/demo"
              className="px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-sm font-semibold transition-all inline-flex items-center gap-2"
            >
              <span>Direct Link to Full Session</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. IMMERSIVE BLUE STUDIO COCKPIT OVERLAY ("when i click on blue coulour interfaces comeee") ── */}
      {isCockpitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl cockpit-modal border border-cyan-500/30 shadow-2xl flex flex-col">
            {/* Cockpit Top Bar */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-cyan-500/20 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <div>
                  <h3 className="font-mono text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>STUDIO COCKPIT · FULL STACK ARCHITECTURE</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Candidate Session #IQ-2026-LIVE · 60 FPS Video Mesh
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-300 font-mono text-xs border border-cyan-500/30">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{formatTimer(cockpitTimer)}</span>
                </div>

                <button
                  onClick={() => setIsCockpitOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cockpit Main Body: 2 Columns */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 overflow-y-auto">
              {/* Left Column (5 cols): Webcam Video + Voice Visualizer + AI State */}
              <div className="lg:col-span-5 space-y-4">
                {/* Simulated Candidate Video Box */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-cyan-500/30 shadow-inner flex flex-col items-center justify-center">
                  {cockpitVideoActive ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950">
                      {/* Face Target Brackets */}
                      <div className="w-32 h-40 border-2 border-cyan-400/40 rounded-2xl relative animate-pulse flex items-center justify-center">
                        <div className="absolute top-1 left-2 text-[9px] font-mono text-cyan-400">FACE MESH 99.4%</div>
                        <div className="w-20 h-20 rounded-full border border-dashed border-cyan-400/30" />
                      </div>

                      {/* Video Controls Bar */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-xs font-mono text-slate-300">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          Webcam Active
                        </span>
                        <button
                          onClick={() => setCockpitVideoActive(false)}
                          className="hover:text-white"
                        >
                          <VideoOff className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <VideoOff className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-400">Webcam Paused</p>
                      <button
                        onClick={() => setCockpitVideoActive(true)}
                        className="px-3 py-1 rounded-lg bg-cyan-600 text-white text-xs font-mono"
                      >
                        Enable Video
                      </button>
                    </div>
                  )}
                </div>

                {/* Real-time Audio Spectrum Waveform Visualizer */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5" /> Live Audio Spectrum
                    </span>
                    <span className="text-slate-400">{isListening ? '44.1 kHz Active' : 'Muted'}</span>
                  </div>

                  {/* Animated Waveform Bars */}
                  <div className="h-10 flex items-end justify-between gap-1 px-2 pt-2">
                    {[40, 75, 20, 95, 60, 85, 30, 90, 45, 100, 65, 80, 50, 70, 35, 90, 55, 75, 40, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full transition-all duration-150"
                        style={{
                          height: isListening ? `${h}%` : '15%',
                          opacity: isListening ? 1 : 0.4,
                        }}
                      />
                    ))}
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={toggleSpeechRecognition}
                      className={`w-full py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                        isListening
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      <span>{isListening ? 'Mute Microphone (Space)' : 'Activate Live Voice Input (Space)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols): Question + Answer Terminal + Evaluation */}
              <div className="lg:col-span-7 space-y-4 flex flex-col">
                {/* Active Question Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold">QUESTION 01 OF 05</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      Technical Deep Dive
                    </span>
                  </div>
                  <h4 className="font-editorial text-base sm:text-lg text-white font-medium">
                    "How does React’s Virtual DOM and Reconciliation algorithm work, and how does the React 18 Fiber architecture enable concurrent rendering?"
                  </h4>
                </div>

                {/* Tab Switcher: Answer Terminal vs 5-Param Rubric */}
                <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
                  <button
                    onClick={() => setActiveCockpitTab('answer')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeCockpitTab === 'answer'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Candidate Terminal Pad
                  </button>
                  <button
                    onClick={() => setActiveCockpitTab('rubric')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeCockpitTab === 'rubric'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    5-Parameter Live Rubric
                  </button>
                </div>

                {/* Tab 1: Terminal Pad */}
                {activeCockpitTab === 'answer' && (
                  <div className="space-y-3 flex-1 flex flex-col">
                    <textarea
                      rows={6}
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className="w-full flex-1 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-cyan-100 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400 leading-relaxed shadow-inner"
                      placeholder="Type your architectural response or click Activate Voice Input..."
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="text-[11px] font-mono text-slate-400">
                        Words: {answerText.split(/\s+/).filter(Boolean).length} · Latency: 12ms
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={runGradingDemo}
                          className="cockpit-neon-btn px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                          <span>Evaluate with Gemini</span>
                        </button>

                        <Link
                          href="/interview/demo"
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all"
                        >
                          Launch Full Session →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: 5-Parameter Rubric */}
                {activeCockpitTab === 'rubric' && (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30 text-xs font-mono">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-300">
                        <span>Technical Accuracy (30% weight)</span>
                        <span className="text-cyan-400 font-bold">92%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '92%' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-300">
                        <span>Relevance &amp; Problem Focus (25% weight)</span>
                        <span className="text-cyan-400 font-bold">90%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '90%' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-300">
                        <span>Communication Clarity (20% weight)</span>
                        <span className="text-cyan-400 font-bold">86%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '86%' }} />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-[11px] text-cyan-200">
                      Overall Weighted Score: <strong>88.6% (Exceptional)</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
