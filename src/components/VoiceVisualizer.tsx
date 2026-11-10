'use client';

import React from 'react';
import { Mic, Volume2, Sparkles, BrainCircuit } from 'lucide-react';

interface VoiceVisualizerProps {
  status: 'idle' | 'listening' | 'speaking' | 'thinking';
  onListenQuestion?: () => void;
  canSpeak?: boolean;
}

export default function VoiceVisualizer({
  status,
  onListenQuestion,
  canSpeak = true,
}: VoiceVisualizerProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'listening':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-pulse">
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span>Listening to Your Voice...</span>
          </span>
        );
      case 'speaking':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-800 animate-pulse">
            <Volume2 className="w-3.5 h-3.5 text-violet-600" />
            <span>AI Interviewer Speaking</span>
          </span>
        );
      case 'thinking':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>AI Analyzing Answer...</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300 border border-navy-200 dark:border-navy-700">
            <BrainCircuit className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>AI Interviewer Ready</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-navy-50/80 via-white to-brand-50/40 dark:from-navy-900/90 dark:via-navy-850 dark:to-brand-950/40 border border-navy-200/80 dark:border-navy-750 shadow-xs">
      {/* Avatar and status */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* Animated halo rings */}
          {status === 'listening' && (
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/30 animate-ping"></div>
          )}
          {status === 'speaking' && (
            <div className="absolute inset-0 rounded-2xl bg-violet-500/30 animate-pulse"></div>
          )}
          {status === 'thinking' && (
            <div className="absolute inset-0 rounded-2xl bg-amber-500/30 animate-spin"></div>
          )}

          <div
            className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              status === 'listening'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/25 ring-4 ring-emerald-500/20'
                : status === 'speaking'
                ? 'bg-gradient-to-tr from-violet-600 to-purple-500 text-white shadow-violet-500/25 ring-4 ring-violet-500/20'
                : status === 'thinking'
                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/25 ring-4 ring-amber-500/20'
                : 'bg-gradient-to-tr from-brand-600 via-royal-600 to-violet-600 text-white shadow-brand-500/20'
            }`}
          >
            <BrainCircuit className="w-7 h-7" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-navy-900 dark:text-white text-sm">
              InterviewIQ AI Assistant
            </h3>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">
            {status === 'listening'
              ? 'Voice recording active. Speak clearly into your microphone.'
              : status === 'speaking'
              ? 'Interviewer is reciting the question prompt.'
              : status === 'thinking'
              ? 'Scoring response against 5 weighted engineering rubrics...'
              : 'Answer by typing or clicking the voice button.'}
          </p>
        </div>
      </div>

      {/* Voice wave bars & listen action */}
      <div className="flex items-center gap-4">
        {/* Animated wave bars */}
        <div className="flex items-center gap-1 h-8 px-3 py-1 rounded-xl bg-white/80 dark:bg-navy-800/80 border border-navy-200/60 dark:border-navy-700/60">
          {[40, 75, 55, 90, 60, 80, 45].map((height, idx) => {
            const isActive = status === 'listening' || status === 'speaking';
            return (
              <div
                key={idx}
                className={`w-1 rounded-full transition-all duration-300 ${
                  status === 'listening'
                    ? 'bg-emerald-500'
                    : status === 'speaking'
                    ? 'bg-violet-500'
                    : 'bg-navy-300 dark:bg-navy-600'
                }`}
                style={{
                  height: isActive ? `${Math.max(8, (height * (idx % 2 === 0 ? 0.9 : 1.2)) % 28)}px` : '6px',
                  animation: isActive ? `wave 1s ease-in-out ${idx * 0.15}s infinite` : 'none',
                }}
              />
            );
          })}
        </div>

        {canSpeak && onListenQuestion && (
          <button
            onClick={onListenQuestion}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-navy-700 dark:text-navy-200 bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-700/80 transition-all shadow-xs"
            title="Read question out loud using speech synthesis"
          >
            <Volume2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Read Question</span>
          </button>
        )}
      </div>
    </div>
  );
}
