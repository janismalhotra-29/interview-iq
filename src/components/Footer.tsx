'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#090A0C] border-t border-zinc-200 dark:border-[#1F2228] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                InterviewIQ
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Technical and behavioral interview practice environment with structured evaluation rubrics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
              Practice modules
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li><Link href="/interview/setup" className="hover:text-zinc-900 dark:hover:text-zinc-100">Technical Coding</Link></li>
              <li><Link href="/interview/setup" className="hover:text-zinc-900 dark:hover:text-zinc-100">System Architecture</Link></li>
              <li><Link href="/interview/setup" className="hover:text-zinc-900 dark:hover:text-zinc-100">Behavioral STAR</Link></li>
              <li><Link href="/interview/setup" className="hover:text-zinc-900 dark:hover:text-zinc-100">Resume Grounded</Link></li>
            </ul>
          </div>

          {/* Performance Tools */}
          <div>
            <h4 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
              Analysis
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li><Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100">Dashboard</Link></li>
              <li><Link href="/analytics" className="hover:text-zinc-900 dark:hover:text-zinc-100">Rubric breakdown</Link></li>
              <li><Link href="/roadmap" className="hover:text-zinc-900 dark:hover:text-zinc-100">Preparation roadmap</Link></li>
              <li><Link href="/history" className="hover:text-zinc-900 dark:hover:text-zinc-100">Session archive</Link></li>
            </ul>
          </div>

          {/* Academic & Ethical Disclosure */}
          <div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228] text-zinc-500 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>Evaluation notice</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Scores represent automated rubric estimates intended strictly for preparation and learning.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-[#1F2228] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <p>© 2026 InterviewIQ. Open-source mock platform.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Next.js 14 App Router</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
