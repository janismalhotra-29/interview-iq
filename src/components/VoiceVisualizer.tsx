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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
            <Mic className="w-3 h-3" />
            <span>Listening to voice...</span>
          </span>
        );
      case 'speaking':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent)]/20 animate-pulse">
            <Volume2 className="w-3 h-3" />
            <span>Interviewer speaking</span>
          </span>
        );
      case 'thinking':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent)]/20">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>Evaluating rubric...</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[var(--text-muted)] bg-[var(--active-bg)] border border-[var(--rule)]">
            <BrainCircuit className="w-3 h-3 text-[var(--accent)]" />
            <span>AI Interviewer Ready</span>
          </span>
        );
    }
  };

  return (
    <div className="paper p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Avatar and status */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {status === 'listening' && (
            <div className="absolute inset-0 rounded-xl bg-emerald-500/20 animate-ping"></div>
          )}
          {status === 'speaking' && (
            <div className="absolute inset-0 rounded-xl bg-[var(--accent)]/20 animate-pulse"></div>
          )}

          <div
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              status === 'listening'
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                : status === 'speaking'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30'
                : 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20'
            }`}
          >
            <BrainCircuit className="w-6 h-6" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-editorial text-base text-[var(--text)] font-medium">
              InterviewIQ Assistant
            </h3>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
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
      <div className="flex items-center gap-3">
        {/* Animated wave bars */}
        <div className="flex items-center gap-1 h-7 px-2.5 py-1 rounded-xl bg-[var(--bg)] border border-[var(--rule)]">
          {[40, 75, 55, 90, 60, 80, 45].map((height, idx) => {
            const isActive = status === 'listening' || status === 'speaking';
            return (
              <div
                key={idx}
                className={`w-1 rounded-full transition-all duration-300 ${
                  status === 'listening'
                    ? 'bg-emerald-500'
                    : status === 'speaking'
                    ? 'bg-[var(--accent)]'
                    : 'bg-[var(--rule)]'
                }`}
                style={{
                  height: isActive ? `${Math.max(6, (height * (idx % 2 === 0 ? 0.9 : 1.2)) % 22)}px` : '5px',
                  animation: isActive ? `wave 1s ease-in-out ${idx * 0.15}s infinite` : 'none',
                }}
              />
            );
          })}
        </div>

        {canSpeak && onListenQuestion && (
          <button
            onClick={onListenQuestion}
            className="btn-enfold-ghost text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Read Question</span>
          </button>
        )}
      </div>
    </div>
  );
}
