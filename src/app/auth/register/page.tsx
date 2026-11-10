'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BrainCircuit, ArrowRight, Lock, Mail, User, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;
    setLoading(true);
    setErrorMsg('');

    const ok = await register(fullName, email, targetRole, experienceLevel);
    setLoading(false);
    if (ok) {
      router.push('/dashboard');
    } else {
      setErrorMsg('Registration failed. Email might already exist.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-royal-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-950 dark:text-white">
            Create Candidate Account
          </h1>
          <p className="text-xs text-navy-500">
            Join InterviewIQ to practice simulated AI technical interviews.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs text-center border border-rose-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jordan Lee"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
              />
            </div>
          </div>

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
                placeholder="jordan.lee@domain.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
              Password
            </label>
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
              >
                <option value="Software Developer">Software Dev</option>
                <option value="Frontend Developer">Frontend Dev</option>
                <option value="Backend Developer">Backend Dev</option>
                <option value="Full Stack Developer">Full Stack Dev</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
                Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 transition-all disabled:opacity-60"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-navy-500">
          Already registered?{' '}
          <Link href="/auth/login" className="font-bold text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
