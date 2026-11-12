'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import VoiceVisualizer from '@/components/VoiceVisualizer';
import { getCached, setCached } from '@/lib/client-cache';
import {
  Clock,
  Mic,
  MicOff,
  Send,
  ArrowRight,
  AlertOctagon,
  Volume2,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  BrainCircuit,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { InterviewSession, InterviewQuestion } from '@/types';

export default function InterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = params.id as string;

  const [session, setSession] = useState<InterviewSession | null>(() => {
    return getCached<InterviewSession>(`session_${sessionId}`);
  });
  const [questions, setQuestions] = useState<InterviewQuestion[]>(() => {
    return getCached<InterviewSession>(`session_${sessionId}`)?.questions || [];
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [isFinalizingSession, setIsFinalizingSession] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(() => !getCached(`session_${sessionId}`));
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Voice recording & synthesis states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [aiState, setAiState] = useState<'idle' | 'listening' | 'speaking' | 'thinking'>('idle');
  const recognitionRef = useRef<any>(null);

  // Timer states
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // End confirmation modal
  const [showEndModal, setShowEndModal] = useState<boolean>(false);

  // Follow-up notification banner
  const [lastFollowupAdded, setLastFollowupAdded] = useState<string | null>(null);

  // Fetch session and questions
  useEffect(() => {
    const cached = getCached<InterviewSession>(`session_${sessionId}`);
    if (cached) {
      setSession(cached);
      setQuestions(cached.questions || []);
      setLoading(false);
    }
    const fetchSession = async () => {
      try {
        if (sessionId === 'demo') {
          const demoSession: InterviewSession = {
            id: 'demo',
            user_id: user?.id || 'd0000000-0000-0000-0000-000000000001',
            title: 'Full Stack Architecture Live Assessment',
            job_role: 'Full Stack Developer',
            experience_level: 'Intermediate',
            interview_type: 'Technical',
            difficulty: 'Hard',
            question_count: 3,
            duration_minutes: 20,
            time_taken_seconds: 0,
            status: 'in_progress',
            created_at: new Date().toISOString(),
            questions: [
              {
                id: 'q-demo-1',
                session_id: 'demo',
                question_number: 1,
                category: 'React Internals',
                question_text: 'How does React’s Virtual DOM and Reconciliation algorithm work, and how does the React 18 Fiber architecture enable concurrent rendering?',
                expected_concepts: ['Virtual DOM', 'Reconciliation', 'Fiber Node', 'Time Slicing', 'useTransition'],
                difficulty: 'Hard',
              },
              {
                id: 'q-demo-2',
                session_id: 'demo',
                question_number: 2,
                category: 'System Design',
                question_text: 'Design a distributed rate limiter that handles 100,000 requests per second across multiple data centers with low latency.',
                expected_concepts: ['Token Bucket', 'Sliding Window Counter', 'Redis Cluster', 'Local In-Memory Cache'],
                difficulty: 'Hard',
              },
              {
                id: 'q-demo-3',
                session_id: 'demo',
                question_number: 3,
                category: 'Behavioral & Leadership',
                question_text: 'Describe a situation where you had a strong technical disagreement with a peer about architecture. How did you resolve it?',
                expected_concepts: ['STAR Framework', 'Objective Benchmarking', 'Empathy', 'Consensus Building'],
                difficulty: 'Medium',
              },
            ],
          };
          setSession(demoSession);
          setQuestions(demoSession.questions || []);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/interviews/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
          setQuestions(data.session.questions || []);
          setCached(`session_${sessionId}`, data.session);

          // Find first unanswered question
          const unansweredIdx = (data.session.questions || []).findIndex(
            (q: InterviewQuestion) => !q.answer
          );
          if (unansweredIdx !== -1) {
            setCurrentIndex(unansweredIdx);
          } else if (data.session.status === 'completed') {
            router.push(`/report/${sessionId}`);
          }
        } else {
          if (!cached) setErrorMsg('Interview session not found.');
        }
      } catch (err: any) {
        if (!cached) setErrorMsg(err.message || 'Error loading interview.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, router]);

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Web Speech Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setCurrentAnswer((prev) => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
          }
        };

        rec.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e.error);
          setIsRecording(false);
          setAiState('idle');
        };

        rec.onend = () => {
          setIsRecording(false);
          setAiState('idle');
        };

        recognitionRef.current = rec;
      } else {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Toggle voice recognition
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setAiState('idle');
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setAiState('listening');
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  // Read current question using SpeechSynthesis
  const speakCurrentQuestion = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const utterance = new SpeechSynthesisUtterance(currentQ.question_text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setAiState('speaking');
    utterance.onend = () => setAiState('idle');
    utterance.onerror = () => setAiState('idle');

    window.speechSynthesis.speak(utterance);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextOrSubmit = async () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer (text or voice) before proceeding.');
      return;
    }

    // Stop recording if active
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const currentQ = questions[currentIndex];
    const timeSpent = Math.max(15, Math.round((Date.now() - questionStartTime) / 1000));

    setIsSubmittingAnswer(true);
    setAiState('thinking');

    try {
      const res = await fetch('/api/evaluate/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQ.id,
          userId: user?.id,
          answerText: currentAnswer,
          inputMethod: isRecording ? 'voice' : 'text',
          timeSpentSeconds: timeSpent,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // If AI generated a dynamic follow-up question, append it to the session question queue!
        if (data.followupQuestion) {
          setQuestions((prev) => [...prev, data.followupQuestion]);
          setLastFollowupAdded(data.followupQuestion.question_text);
        }

        // Check if there are more questions
        if (currentIndex + 1 < questions.length || data.followupQuestion) {
          setCurrentIndex((prev) => prev + 1);
          setCurrentAnswer('');
          setQuestionStartTime(Date.now());
          setAiState('idle');
        } else {
          // All questions answered, finalize session!
          await finalizeInterview();
        }
      }
    } catch (err: any) {
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const finalizeInterview = async () => {
    setIsFinalizingSession(true);
    setAiState('thinking');

    try {
      const res = await fetch('/api/evaluate/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: user?.id,
          timeTakenSeconds: secondsElapsed,
        }),
      });

      if (res.ok) {
        router.push(`/report/${sessionId}`);
      }
    } catch (err) {
      console.error('Finalize session error:', err);
    } finally {
      setIsFinalizingSession(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--rule)] border-t-[var(--accent)] rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[var(--text-muted)]">Preparing mock interview simulation room...</p>
      </div>
    );
  }

  if (errorMsg || !session || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-2xl paper text-center space-y-4">
        <AlertOctagon className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="font-editorial text-lg text-[var(--text)] font-medium">Session Unavailable</h2>
        <p className="text-xs text-[var(--text-muted)]">{errorMsg || 'Could not load interview session.'}</p>
        <button
          onClick={() => router.push('/interview/setup')}
          className="btn-enfold text-xs py-2 px-5 mx-auto"
        >
          Return to Setup
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header Bar: Session Info, Timer & End Button */}
      <div className="paper p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20 flex items-center justify-center font-bold">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-editorial text-base sm:text-lg text-[var(--text)] font-medium flex items-center gap-2">
              <span>{session.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
                {session.difficulty}
              </span>
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {session.job_role} · {session.interview_type} Mode
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg)] text-[var(--text)] font-mono text-xs border border-[var(--rule)]">
            <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="font-bold">{formatTimer(secondsElapsed)}</span>
            <span className="text-[10px] text-[var(--text-muted)]">/ {session.duration_minutes}m</span>
          </div>

          <button
            onClick={() => setShowEndModal(true)}
            className="btn-enfold-ghost text-xs px-3 py-1.5 text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>
            Question {currentIndex + 1} of {questions.length}
            {currentQ.is_followup && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] text-[10px] font-bold border border-[var(--accent)]/20">
                Adaptive Follow-Up
              </span>
            )}
          </span>
          <span className="font-bold text-[var(--accent)]">{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--rule)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* AI Interviewer Avatar & Voice State Indicator */}
      <VoiceVisualizer
        status={aiState}
        onListenQuestion={speakCurrentQuestion}
        canSpeak={true}
      />

      {/* Dynamic follow-up alert banner if just triggered */}
      {lastFollowupAdded && currentIndex === questions.length - 1 && (
        <div className="paper p-3.5 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent)]/20 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span className="text-[var(--text)]">
            <strong>Adaptive Follow-up:</strong> The AI interviewer observed your previous response and generated this follow-up inquiry to test depth.
          </span>
        </div>
      )}

      {/* Current Question Card */}
      <div className="paper p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
            {currentQ.category}
          </span>
          <button
            onClick={speakCurrentQuestion}
            className="btn-enfold-ghost text-xs px-2.5 py-1 inline-flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Listen Aloud</span>
          </button>
        </div>

        <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--text)] leading-relaxed font-medium">
          {currentQ.question_text}
        </h2>

        {/* Expected Concepts tags hint (expandable) */}
        {currentQ.expected_concepts && currentQ.expected_concepts.length > 0 && (
          <div className="pt-1">
            <details className="text-xs text-[var(--text-muted)] group">
              <summary className="cursor-pointer font-mono hover:text-[var(--accent)] flex items-center gap-1.5 select-none">
                <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Evaluation Focus Hints (Click to toggle)</span>
              </summary>
              <div className="mt-2.5 flex flex-wrap gap-1.5 p-3 rounded-xl bg-[var(--bg)] border border-[var(--rule)]">
                {currentQ.expected_concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--paper)] text-[var(--text)] border border-[var(--rule)]"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Answer Input Section (Text + Voice STT) */}
      <div className="paper p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Candidate Response</span>
          </label>

          {/* Voice Input Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/25 ring-2 ring-rose-300'
                  : 'btn-enfold-ghost'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[var(--accent)]" />}
              <span>{isRecording ? 'Stop Recording' : 'Voice Input (STT)'}</span>
            </button>
          )}
        </div>

        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Articulate your thought process clearly... Structure your response with key architectural trade-offs, principles, and edge cases."
          rows={7}
          className="w-full p-4 rounded-xl bg-[var(--bg)] border border-[var(--rule)] text-xs sm:text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] leading-relaxed transition-all"
        />

        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
          <span>{currentAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
          <span>
            {isRecording ? (
              <span className="text-emerald-600 font-semibold animate-pulse">
                Transcribing voice speech in real-time...
              </span>
            ) : (
              'Responses are analyzed across 5 academic rubrics'
            )}
          </span>
        </div>

        {/* Action Buttons: Next Question or Finalize */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCurrentAnswer('')}
            disabled={!currentAnswer}
            className="btn-enfold-ghost text-xs px-3 py-1.5 disabled:opacity-40"
          >
            Clear Text
          </button>

          <button
            type="button"
            onClick={handleNextOrSubmit}
            disabled={isSubmittingAnswer || isFinalizingSession || !currentAnswer.trim()}
            className="btn-accent px-6 py-2.5 text-xs disabled:opacity-60"
          >
            {isSubmittingAnswer || isFinalizingSession ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{currentIndex + 1 === questions.length ? 'Finalizing Evaluation...' : 'Submitting Answer...'}</span>
              </>
            ) : (
              <>
                <span>{currentIndex + 1 === questions.length ? 'Submit Final Answer & Generate Report' : 'Submit & Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal to End Interview Early */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl paper space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-editorial text-lg text-[var(--text)] font-medium">
                  End Interview Early?
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  You have answered {currentIndex} of {questions.length} questions.
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-soft)] leading-relaxed">
              If you end now, an evaluation report will be compiled based solely on the answers submitted so far.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="btn-enfold-ghost text-xs px-3 py-1.5"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={finalizeInterview}
                disabled={isFinalizingSession}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {isFinalizingSession ? 'Compiling Report...' : 'Yes, End & Evaluate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
