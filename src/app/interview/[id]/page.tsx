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
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-navy-500">Preparing mock interview simulation room...</p>
      </div>
    );
  }

  if (errorMsg || !session || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-200 dark:border-navy-750 text-center space-y-4">
        <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-navy-900 dark:text-white">Session Unavailable</h2>
        <p className="text-xs text-navy-500">{errorMsg || 'Could not load interview session.'}</p>
        <button
          onClick={() => router.push('/interview/setup')}
          className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
        >
          Return to Setup
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header Bar: Session Info, Timer & End Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-navy-900 dark:text-white flex items-center gap-2">
              <span>{session.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-100 dark:bg-navy-750 text-navy-600 dark:text-navy-300 font-semibold">
                {session.difficulty}
              </span>
            </h1>
            <p className="text-xs text-navy-500 dark:text-navy-400">
              {session.job_role} • {session.interview_type} Mode
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-300 font-mono font-bold text-xs border border-navy-200 dark:border-navy-700">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>{formatTimer(secondsElapsed)}</span>
            <span className="text-[10px] text-navy-400 font-sans">/ {session.duration_minutes}m</span>
          </div>

          <button
            onClick={() => setShowEndModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition-colors"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-navy-500 dark:text-navy-400">
          <span>
            Question {currentIndex + 1} of {questions.length}
            {currentQ.is_followup && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[10px] font-bold">
                Dynamic AI Follow-Up
              </span>
            )}
          </span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2 rounded-full bg-navy-100 dark:bg-navy-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-royal-500 transition-all duration-300"
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
        <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
          <span>
            <strong>Adaptive Follow-up:</strong> The AI interviewer observed your previous response and generated this follow-up inquiry to test depth.
          </span>
        </div>
      )}

      {/* Current Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800">
            {currentQ.category}
          </span>
          <button
            onClick={speakCurrentQuestion}
            className="flex items-center gap-1 text-xs text-navy-500 dark:text-navy-400 hover:text-brand-600 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen</span>
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-white leading-relaxed">
          {currentQ.question_text}
        </h2>

        {/* Expected Concepts tags hint (expandable) */}
        {currentQ.expected_concepts && currentQ.expected_concepts.length > 0 && (
          <div className="pt-2">
            <details className="text-xs text-navy-500 dark:text-navy-400 group">
              <summary className="cursor-pointer font-semibold hover:text-brand-600 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-navy-400" />
                <span>Evaluation Focus Hints (Click to toggle)</span>
              </summary>
              <div className="mt-2.5 flex flex-wrap gap-1.5 p-3 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-100 dark:border-navy-800">
                {currentQ.expected_concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-700 font-medium"
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
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span>Your Response</span>
          </label>

          {/* Voice Input Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/25 ring-2 ring-rose-300'
                  : 'bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200 hover:bg-navy-200'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isRecording ? 'Stop Recording' : 'Voice Input (STT)'}</span>
            </button>
          )}
        </div>

        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Articulate your thought process clearly... You can structure your response with key principles, architectural trade-offs, and failure recovery strategies."
          rows={7}
          className="w-full p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white placeholder:text-navy-400 focus:ring-2 focus:ring-brand-500 font-sans leading-relaxed transition-all"
        />

        <div className="flex items-center justify-between text-xs text-navy-500 dark:text-navy-400">
          <span>{currentAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
          <span>
            {isRecording ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
                Transcribing voice speech in real-time...
              </span>
            ) : (
              'Answers are analyzed across 5 academic engineering parameters'
            )}
          </span>
        </div>

        {/* Action Buttons: Next Question or Finalize */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCurrentAnswer('')}
            disabled={!currentAnswer}
            className="text-xs text-navy-500 hover:text-navy-800 dark:hover:text-white disabled:opacity-40"
          >
            Clear Answer
          </button>

          <button
            type="button"
            onClick={handleNextOrSubmit}
            disabled={isSubmittingAnswer || isFinalizingSession || !currentAnswer.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-royal-600 hover:from-brand-700 hover:to-royal-700 text-white font-extrabold text-sm shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmittingAnswer || isFinalizingSession ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{currentIndex + 1 === questions.length ? 'Finalizing Evaluation...' : 'Submitting Answer...'}</span>
              </>
            ) : (
              <>
                <span>{currentIndex + 1 === questions.length ? 'Submit Final Answer & Generate Report' : 'Submit & Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal to End Interview Early */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-200 dark:border-navy-700 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-navy-900 dark:text-white text-base">
                  End Interview Early?
                </h3>
                <p className="text-xs text-navy-500">
                  You have answered {currentIndex} of {questions.length} questions.
                </p>
              </div>
            </div>

            <p className="text-xs text-navy-600 dark:text-navy-300 leading-relaxed">
              If you end now, an evaluation report will be compiled based solely on the answers submitted so far.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={finalizeInterview}
                disabled={isFinalizingSession}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
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
