'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { parseResumeContent } from '@/lib/resume-parser';
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
  X,
} from 'lucide-react';
import { RoleType, ExperienceLevel, InterviewType, DifficultyLevel } from '@/types';

export default function InterviewSetupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [isDragging, setIsDragging] = useState<boolean>(false);

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

  const handleProcessFile = async (file: File) => {
    setIsParsingResume(true);
    try {
      let text = await file.text();
      // Clean non-printable characters for text extraction
      text = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      setResumeText(text);

      const parsed = parseResumeContent(text);
      setParsedData(parsed);

      if (parsed.detectedRole) {
        const matched = jobRoles.find((r) => r.toLowerCase().includes(parsed.detectedRole!.toLowerCase()));
        if (matched) setJobRole(matched);
      }
    } catch (err) {
      console.error('Resume parse error:', err);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleTextChange = (text: string) => {
    setResumeText(text);
    if (text.trim().length > 10) {
      const parsed = parseResumeContent(text);
      setParsedData(parsed);
      if (parsed.detectedRole) {
        const matched = jobRoles.find((r) => r.toLowerCase().includes(parsed.detectedRole!.toLowerCase()));
        if (matched) setJobRole(matched);
      }
    } else {
      setParsedData(null);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-1.5 pb-4 border-b border-[var(--rule)]">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)]">
          <Sliders className="w-3.5 h-3.5" />
          <span>Session setup</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[var(--text)] tracking-tight">
          Configure Interview <em>Session</em>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Select target discipline, difficulty level, and optionally upload a resume to ground questions in your verified projects.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 text-xs font-mono">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleStartInterview} className="space-y-6">
        {/* Main Settings Card */}
        <div className="paper p-6 sm:p-7 rounded-2xl space-y-6">
          <h2 className="font-editorial text-lg text-[var(--text)] font-medium flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[var(--accent)]" />
            <span>Target Role &amp; Discipline</span>
          </h2>

          {/* Job Role Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Select Job Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {jobRoles.map((role) => {
                const selected = jobRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setJobRole(role)}
                    className={`p-2.5 rounded-xl text-xs text-left transition-all border ${
                      selected
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm font-semibold'
                        : 'bg-[var(--bg)] border-[var(--rule)] text-[var(--text)] hover:border-[var(--text-muted)]'
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
              <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
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
                      className={`p-2 rounded-xl text-xs text-center transition-all border ${
                        selected
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm font-semibold'
                          : 'bg-[var(--bg)] border-[var(--rule)] text-[var(--text)] hover:border-[var(--text-muted)]'
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
              <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
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
                      className={`p-2 rounded-xl text-xs text-center transition-all border ${
                        selected
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm font-semibold'
                          : 'bg-[var(--bg)] border-[var(--rule)] text-[var(--text)] hover:border-[var(--text-muted)]'
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--rule)]">
            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--text)] font-medium focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="Easy">Easy (Fundamentals & Core syntax)</option>
                <option value="Medium">Medium (Industry standard engineering)</option>
                <option value="Hard">Hard (Deep systems & edge cases)</option>
                <option value="FAANG">FAANG / Top Tier (High scale & tradeoffs)</option>
              </select>
            </div>

            {/* Questions count */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--text)] font-medium focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="3">3 Questions (Quick Blitz - ~10 min)</option>
                <option value="5">5 Questions (Standard Mock - ~20 min)</option>
                <option value="10">10 Questions (Comprehensive - ~35 min)</option>
                <option value="15">15 Questions (Full Gauntlet - ~50 min)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Target Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--text)] font-medium focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes (Recommended)</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resume Upload & Parsing Module */}
        <div className="paper p-6 sm:p-7 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-lg text-[var(--text)] font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--accent)]" />
              <span>Resume-Based Question Grounding (Optional)</span>
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
              Personalized
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Upload your resume or paste its text. The AI will parse your highlighted tech stack and frame questions reflecting real hiring inquiries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleProcessFile(file);
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                  : 'border-[var(--rule)] hover:border-[var(--accent)] bg-[var(--bg)]'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-[var(--accent)] mb-2" />
              <span className="text-xs font-semibold text-[var(--accent)]">
                {isParsingResume ? 'Processing resume...' : 'Click or drop resume file here'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeFileUpload}
              />
              <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1.5">
                Supports .pdf, .docx, .txt, .md, .json
              </p>
            </div>

            {/* Paste Text Area */}
            <div className="space-y-2">
              <textarea
                value={resumeText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Or paste resume skills/projects (e.g. React, Node.js, AWS, Redis, Kafka, PostgreSQL, Docker, PyTorch...)"
                rows={4}
                className="w-full p-3 rounded-xl bg-[var(--bg)] border border-[var(--rule)] text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTextChange("Full Stack Developer with experience in React, Next.js, TypeScript, Node.js, Express, PostgreSQL, Redis, Docker, and AWS microservices. Built scalable backend architectures.")}
                  className="text-[11px] font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Try Sample Skills (1-Click)</span>
                </button>
                {resumeText && (
                  <button
                    type="button"
                    onClick={() => { setResumeText(''); setParsedData(null); }}
                    className="text-[10px] font-mono text-[var(--text-muted)] hover:text-rose-500"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Parsed Resume Preview Badge Box */}
          {parsedData && (
            <div className="p-3.5 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)]/20 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between font-medium text-[var(--text)]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Skills detected &amp; tailored</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    ({parsedData.experienceYearsEstimate})
                  </span>
                </div>
                {parsedData.detectedRole && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--paper)] text-[var(--accent)] border border-[var(--rule)]">
                    Role: {parsedData.detectedRole}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {parsedData.extractedSkills?.map((s: string) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--paper)] text-[var(--text)] border border-[var(--rule)] font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit & Start Button */}
        <div className="paper p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[var(--text-muted)] space-y-0.5">
            <p className="font-editorial text-sm font-medium text-[var(--text)]">
              {jobRole} · {difficulty} · {questionCount} Questions
            </p>
            <p className="text-[11px]">Speech recognition transcription &amp; live timer ready in room.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-enfold py-2.5 px-6 text-xs disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Generating questions...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Begin Mock Session</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
