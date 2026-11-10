'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Sparkles,
  FileText,
  UploadCloud,
  Check,
  Play,
  Sliders,
  BrainCircuit,
  Clock,
  Layers,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';
import { RoleType, ExperienceLevel, InterviewType, DifficultyLevel } from '@/types';

export default function InterviewSetupPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [jobRole, setJobRole] = useState<RoleType>('Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediate');
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [durationMinutes, setDurationMinutes] = useState<number>(20);

  // Resume state
  const [resumeText, setResumeText] = useState<string>('');
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<any>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const jobRoles: RoleType[] = [
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'AI/ML Engineer',
    'Data Scientist',
    'Data Analyst',
    'System Design Engineer',
    'DevOps / Cloud Engineer',
    'Product Manager',
  ];

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    try {
      const text = await file.text();
      setResumeText(text);

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const json = await res.json();
        setParsedData(json.data);
        if (json.data.detectedRole) {
          const matched = jobRoles.find((r) => r.toLowerCase().includes(json.data.detectedRole.toLowerCase()));
          if (matched) setJobRole(matched);
        }
      }
    } catch (err) {
      console.error('Resume parse error:', err);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handlePasteResumeParse = async () => {
    if (!resumeText.trim()) return;
    setIsParsingResume(true);
    try {
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: resumeText }),
      });
      if (res.ok) {
        const json = await res.json();
        setParsedData(json.data);
      }
    } catch (err) {
      console.error('Error parsing pasted resume:', err);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          jobRole,
          experienceLevel,
          interviewType,
          difficulty,
          questionCount,
          durationMinutes,
          resumeContext: parsedData ? JSON.stringify(parsedData) : resumeText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/interview/${data.session.id}`);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to initialize interview session.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
          <Sliders className="w-3.5 h-3.5" />
          <span>Session setup</span>
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Configure interview session
        </h1>
        <p className="text-xs text-zinc-500">
          Select role, target difficulty level, and optionally upload a resume to ground questions in your project experience.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleStartInterview} className="space-y-8">
        {/* Main Settings Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-brand-600" />
            <span>Target Role & Discipline</span>
          </h2>

          {/* Job Role Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
              Select Job Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {jobRoles.map((role) => {
                const selected = jobRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setJobRole(role)}
                    className={`p-3 rounded-2xl text-xs font-medium text-left transition-all border ${
                      selected
                        ? 'bg-brand-50 dark:bg-brand-950/80 border-brand-500 text-brand-700 dark:text-brand-300 shadow-xs ring-2 ring-brand-500/20 font-semibold'
                        : 'bg-white dark:bg-navy-800 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:border-brand-300 dark:hover:border-navy-600'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience Level & Interview Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((level) => {
                  const selected = experienceLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperienceLevel(level)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-center transition-all border ${
                        selected
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs font-semibold'
                          : 'bg-white dark:bg-navy-800 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interview Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
                Interview Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Technical', 'HR', 'Behavioral', 'Mixed', 'System Design'] as InterviewType[]).map((type) => {
                  const selected = interviewType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInterviewType(type)}
                      className={`p-2 rounded-xl text-xs font-medium text-center transition-all border ${
                        selected
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs font-semibold'
                          : 'bg-white dark:bg-navy-800 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Difficulty & Number of Questions & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-navy-100 dark:border-navy-800">
            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs font-semibold text-navy-800 dark:text-navy-200 focus:ring-2 focus:ring-brand-500"
              >
                <option value="Easy">Easy (Fundamentals & Core syntax)</option>
                <option value="Medium">Medium (Industry standard engineering)</option>
                <option value="Hard">Hard (Deep systems & edge cases)</option>
                <option value="FAANG">FAANG / Top Tier (High scale & tradeoffs)</option>
              </select>
            </div>

            {/* Questions count */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs font-semibold text-navy-800 dark:text-navy-200 focus:ring-2 focus:ring-brand-500"
              >
                <option value="3">3 Questions (Quick Blitz - ~10 min)</option>
                <option value="5">5 Questions (Standard Mock - ~20 min)</option>
                <option value="10">10 Questions (Comprehensive - ~35 min)</option>
                <option value="15">15 Questions (Full Gauntlet - ~50 min)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-navy-700 dark:text-navy-300 uppercase tracking-wider">
                Target Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs font-semibold text-navy-800 dark:text-navy-200 focus:ring-2 focus:ring-brand-500"
              >
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes (Recommended)</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resume Upload & Parsing Module (Premium Feature) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-850 border border-navy-100 dark:border-navy-750 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              <span>Resume-Based Question Tailoring (Optional)</span>
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
              Personalized AI Mode
            </span>
          </div>
          <p className="text-xs text-navy-500 dark:text-navy-400">
            Upload your resume or paste its text. The AI will parse your highlighted tech stack and frame personalized questions mirroring real hiring manager inquiries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload zone */}
            <div className="border-2 border-dashed border-navy-200 dark:border-navy-700 rounded-2xl p-6 text-center hover:border-brand-500 dark:hover:border-brand-500 transition-colors flex flex-col items-center justify-center">
              <UploadCloud className="w-8 h-8 text-navy-400 mb-2" />
              <label className="cursor-pointer">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
                  Click to upload resume (.txt, .md, .json)
                </span>
                <input
                  type="file"
                  accept=".txt,.md,.json,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleResumeFileUpload}
                />
              </label>
              <p className="text-[11px] text-navy-400 mt-1">Text-based files processed instantly</p>
            </div>

            {/* Paste Text Area */}
            <div className="space-y-2">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste your resume text here (e.g. skills: React, Node.js, AWS, Redis, GraphQL...)"
                rows={4}
                className="w-full p-3 rounded-2xl bg-navy-50 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white placeholder:text-navy-400 focus:ring-2 focus:ring-brand-500"
              />
              {resumeText && !parsedData && (
                <button
                  type="button"
                  onClick={handlePasteResumeParse}
                  disabled={isParsingResume}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isParsingResume ? 'Parsing skills...' : 'Analyze pasted resume'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Parsed Resume Preview Badge Box */}
          {parsedData && (
            <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-900 dark:text-brand-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Resume parsed successfully!</span>
                <span className="text-[11px] font-normal text-navy-500 dark:text-navy-400">
                  ({parsedData.experienceYearsEstimate})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {parsedData.extractedSkills?.map((s: string) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-brand-800 dark:text-brand-300 font-medium">
                Questions will be tailored to your verified skill portfolio.
              </p>
            </div>
          )}
        </div>

        {/* Submit & Start Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228]">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {jobRole} • {difficulty} • {questionCount} Questions
            </p>
            <p className="text-[11px] text-zinc-500">Voice answer transcription & timer active in the session room.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-xs hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Generating questions...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Begin mock session</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
