'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-navy-950 border-t border-navy-100 dark:border-navy-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-royal-600 flex items-center justify-center text-white">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-navy-900 dark:text-white">
                Interview<span className="text-brand-600 dark:text-brand-400">IQ</span>
              </span>
            </div>
            <p className="text-xs text-navy-500 dark:text-navy-400 leading-relaxed">
              Empowering students and software engineers to master technical, system design, and behavioral interviews with real-time AI mock simulations and actionable multi-dimensional feedback.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All AI Evaluation Engines Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-navy-900 dark:text-white uppercase tracking-wider mb-3">
              Preparation Modules
            </h4>
            <ul className="space-y-2 text-xs text-navy-600 dark:text-navy-400">
              <li><Link href="/interview/setup" className="hover:text-brand-600 dark:hover:text-brand-300">Technical Coding Mock</Link></li>
              <li><Link href="/interview/setup" className="hover:text-brand-600 dark:hover:text-brand-300">System Design Interviews</Link></li>
              <li><Link href="/interview/setup" className="hover:text-brand-600 dark:hover:text-brand-300">HR & Behavioral STAR Practice</Link></li>
              <li><Link href="/interview/setup" className="hover:text-brand-600 dark:hover:text-brand-300">Resume-Tailored Questions</Link></li>
            </ul>
          </div>

          {/* Performance Tools */}
          <div>
            <h4 className="text-xs font-semibold text-navy-900 dark:text-white uppercase tracking-wider mb-3">
              Analytics & Insights
            </h4>
            <ul className="space-y-2 text-xs text-navy-600 dark:text-navy-400">
              <li><Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-300">Student Dashboard</Link></li>
              <li><Link href="/analytics" className="hover:text-brand-600 dark:hover:text-brand-300">5-Metric Radar Breakdown</Link></li>
              <li><Link href="/roadmap" className="hover:text-brand-600 dark:hover:text-brand-300">Personalized Learning Roadmap</Link></li>
              <li><Link href="/badges" className="hover:text-brand-600 dark:hover:text-brand-300">Badges & Skill Milestones</Link></li>
            </ul>
          </div>

          {/* Academic & Ethical Disclosure */}
          <div>
            <div className="p-3.5 rounded-2xl bg-navy-50 dark:bg-navy-900/60 border border-navy-100 dark:border-navy-800 text-navy-600 dark:text-navy-300 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-navy-800 dark:text-navy-200">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Ethical AI Disclosure</span>
              </div>
              <p className="text-[11px] text-navy-500 dark:text-navy-400 leading-normal">
                Evaluation scores represent automated linguistic and algorithmic estimates designed exclusively for study and iterative practice. Scores do not evaluate psychological confidence or guarantee hiring outcomes.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-navy-100 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-500 dark:text-navy-400">
          <p>© 2026 InterviewIQ Platform. Built for engineering excellence and student career readiness.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & Next.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
