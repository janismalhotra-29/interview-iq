'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  User,
  Key,
  Save,
  CheckCircle2,
  Shield,
  Sparkles,
  Building,
  Briefcase,
  Layers,
  Moon,
  Sun,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ExperienceLevel } from '@/types';

export default function ProfilePage() {
  const { user, profile, updateProfile, theme, toggleTheme } = useAuth();

  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediate');
  const [bio, setBio] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [companiesStr, setCompaniesStr] = useState('');
  const [customGeminiKey, setCustomGeminiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (profile) {
      setTargetRole(profile.target_role || 'Software Developer');
      setExperienceLevel(profile.experience_level || 'Intermediate');
      setBio(profile.bio || '');
      setSkillsStr((profile.skills || []).join(', '));
      setCompaniesStr((profile.target_companies || []).join(', '));
      setCustomGeminiKey(profile.custom_gemini_key || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    const skills = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const targetCompanies = companiesStr.split(',').map((c) => c.trim()).filter(Boolean);

    const ok = await updateProfile({
      target_role: targetRole,
      experience_level: experienceLevel,
      bio,
      skills,
      target_companies: targetCompanies,
      custom_gemini_key: customGeminiKey,
    });

    setSaving(false);
    if (ok) {
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
          Candidate Profile & AI Keys
        </h1>
        <p className="text-sm text-navy-500 dark:text-navy-400">
          Tailor your default interview settings, dream target companies, and optional custom LLM credentials.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile configuration successfully saved!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Info Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-navy-100 dark:border-navy-800">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user?.full_name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center font-extrabold text-xl ring-4 ring-brand-500/20 shadow-md">
                {user?.full_name
                  ? user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                  : 'AM'}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">
                {user?.full_name}
              </h2>
              <p className="text-xs text-navy-500">{user?.email}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded-full">
                Student / Job Seeker
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand-600" />
                <span>Primary Target Role</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-600" />
                <span>Experience Level</span>
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
              >
                <option value="Beginner">Beginner (0-1 yrs)</option>
                <option value="Intermediate">Intermediate (2-4 yrs)</option>
                <option value="Advanced">Advanced / Senior (5+ yrs)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-brand-600" />
              <span>Target Companies (Comma-separated)</span>
            </label>
            <input
              type="text"
              value={companiesStr}
              onChange={(e) => setCompaniesStr(e.target.value)}
              placeholder="e.g. Google, Stripe, Microsoft, OpenAI"
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
              Core Skills & Technologies
            </label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker, Redis"
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
              Candidate Bio & Goals
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Brief summary of your professional background..."
              className="w-full p-3 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
            />
          </div>
        </div>

        {/* Custom AI Provider Keys (Optional Override) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-brand-600" />
              <span>Custom Gemini AI Key (Optional)</span>
            </h2>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              Built-in Engine Active
            </span>
          </div>

          <p className="text-xs text-navy-500 dark:text-navy-400 leading-relaxed">
            The platform includes an intelligent semantic evaluation engine out-of-the-box. If you prefer to connect your own Google Gemini API key for direct live LLM generation, enter it below. Keys are securely stored and never exposed on the client.
          </p>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={customGeminiKey}
              onChange={(e) => setCustomGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="font-bold text-navy-900 dark:text-white text-sm">
              Interface Appearance
            </h3>
            <p className="text-xs text-navy-500">
              Toggle between clean light SaaS aesthetic and high-contrast dark mode.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-navy-100 dark:bg-navy-800 text-navy-800 dark:text-navy-200 border border-navy-200 dark:border-navy-700"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-600" />}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-royal-600 hover:from-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
