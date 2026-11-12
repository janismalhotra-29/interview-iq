'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--paper)] border-t border-[var(--rule)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-2">
            <span className="font-editorial text-lg tracking-tight text-[var(--text)] font-semibold">
              Interview<em className="text-[var(--accent)] not-italic font-normal italic ml-0.5">IQ</em>
            </span>
            <p className="text-xs text-[var(--text-soft)] leading-relaxed">
              Open only what you need. Calm technical and behavioral interview preparation with structured rubric evaluation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
              Practice modules
            </h4>
            <ul className="space-y-1.5 text-xs text-[var(--text-soft)]">
              <li><Link href="/interview/setup" className="hover:text-[var(--text)]">Technical Coding</Link></li>
              <li><Link href="/interview/setup" className="hover:text-[var(--text)]">System Architecture</Link></li>
              <li><Link href="/interview/setup" className="hover:text-[var(--text)]">Behavioral STAR</Link></li>
              <li><Link href="/interview/setup" className="hover:text-[var(--text)]">Resume Grounded</Link></li>
            </ul>
          </div>

          {/* Performance Tools */}
          <div>
            <h4 className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
              Analysis
            </h4>
            <ul className="space-y-1.5 text-xs text-[var(--text-soft)]">
              <li><Link href="/dashboard" className="hover:text-[var(--text)]">Dashboard</Link></li>
              <li><Link href="/analytics" className="hover:text-[var(--text)]">Rubric breakdown</Link></li>
              <li><Link href="/roadmap" className="hover:text-[var(--text)]">Preparation roadmap</Link></li>
              <li><Link href="/history" className="hover:text-[var(--text)]">Session archive</Link></li>
            </ul>
          </div>

          {/* Academic & Ethical Disclosure */}
          <div>
            <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--rule)] text-[var(--text-soft)] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Evaluation notice</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                Scores represent automated rubric estimates intended strictly for preparation and learning.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--rule)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
          <p>© 2026 InterviewIQ. Open only what you need.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Tactile Paper Architecture • Next.js 14</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
