'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-royal-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-950 dark:text-white">
            Reset Password
          </h1>
          <p className="text-xs text-navy-500">
            Enter your email and we'll send a password recovery reset link.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
              Reset Link Dispatched
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              If an account matches <strong>{email}</strong>, check your inbox for instructions to set a new password.
            </p>
            <Link
              href="/auth/login"
              className="inline-block mt-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 underline"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 transition-all"
            >
              Send Password Reset Link
            </button>

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs text-navy-500 hover:text-navy-800 dark:hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
