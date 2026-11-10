'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BrainCircuit, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg('');

    const ok = await login(email);
    setLoading(false);
    if (ok) {
      router.push('/dashboard');
    } else {
      setErrorMsg('Invalid login credentials.');
    }
  };

  const handleQuickDemo = async (demoKey: 'alex' | 'priya') => {
    setLoading(true);
    await switchDemoUser(demoKey);
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-royal-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-950 dark:text-white">
            Welcome back to InterviewIQ
          </h1>
          <p className="text-xs text-navy-500">
            Enter your credentials or click a preloaded demo persona.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs text-center border border-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Demo Fast Track Login */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block text-center">
            One-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('alex')}
              className="p-2.5 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 hover:bg-brand-100 transition-colors text-xs font-semibold flex flex-col items-center gap-0.5"
            >
              <span>Alex Morgan</span>
              <span className="text-[10px] font-normal text-navy-500">Full Stack Aspirant</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('priya')}
              className="p-2.5 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/70 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100 transition-colors text-xs font-semibold flex flex-col items-center gap-0.5"
            >
              <span>Priya Sharma</span>
              <span className="text-[10px] font-normal text-navy-500">AI / ML Engineer</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-navy-200 dark:border-navy-700" />
          <span className="px-3 bg-white dark:bg-navy-850 text-[10px] font-semibold text-navy-400 uppercase tracking-wider absolute">
            Or standard login
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-[11px] text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 transition-all disabled:opacity-60"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-navy-500">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-bold text-brand-600 hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
