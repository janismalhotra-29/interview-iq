# InterviewIQ – AI-Powered Interview Preparation & Evaluation System

**InterviewIQ** is an enterprise-grade AI SaaS web application designed for engineering students and job seekers to prepare for technical, system design, and HR behavioral interviews. It features real-time simulated interviews, Web Speech Recognition for live voice transcription, speech synthesis, an automated 5-parameter AI evaluation engine, interactive Recharts analytics, and personalized learning roadmaps.

---

## 🌟 Key Features

1. **AI Mock Interview Room**
   - Interactive AI avatar with live audio waveform visualizer (Speaking, Listening, Thinking, Idle states).
   - Voice answer input powered by the browser **Web Speech Recognition API** with live transcription.
   - Text-to-Speech (TTS) option allowing the interviewer to read questions aloud.
   - **Dynamic Adaptive Follow-up Engine**: If an answer lacks depth, the AI dynamically injects technical follow-up questions to test edge cases.
   - Real-time session timer and progress tracking.

2. **Rigorous 5-Parameter AI Evaluation Engine**
   Scores every response strictly according to the academic weighting formula:
   - **Technical Accuracy (30%)**: Correctness of mechanisms, algorithms, and domain knowledge.
   - **Relevance (25%)**: Direct responsiveness to prompt without fluff.
   - **Communication (20%)**: Structural clarity, conciseness, and articulation of tradeoffs.
   - **Completeness (15%)**: Coverage of edge cases, failure modes, and depth.
   - **Problem-Solving Approach (10%)**: Methodical breakdown and architectural justification.
   - *Ethical AI Disclosure*: Transparently distinguishes automated linguistic heuristics from psychological traits.

3. **Multi-Dimensional Analytics Dashboard**
   - Recharts Radar chart visualizing candidate proficiencies across all 5 evaluation dimensions.
   - Historical trajectory area chart tracking score evolution over time.
   - Session-by-session performance comparison bar chart.
   - Strongest skill highlight and areas requiring targeted revision.

4. **Resume Upload & Parsing**
   - Upload (`.txt`, `.pdf`, `.md`, `.json`) or paste resume text.
   - Extracts skills, frameworks, and projects to generate custom tailored interview questions.

5. **Downloadable PDF Reports**
   - Clean printable layout with `@media print` styling to export reports as PDFs with one click.

6. **Gamified Badges & Learning Roadmap**
   - Unlock badges (*First Step*, *Top Performer*, *Consistency Master*, *Technical Guru*).
   - Actionable revision items with links to LeetCode and System Design Primers.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Next.js Server API Routes with async input validation.
- **AI Engine**: Supports **Google Gemini API** (`GEMINI_API_KEY`) & **OpenAI API** (`OPENAI_API_KEY`) with an intelligent built-in semantic NLP evaluation engine fallback.
- **Database**:
  - PostgreSQL schema ready for **Supabase** with Row Level Security (RLS) policies and indexes (`database/schema.sql`).
  - Embedded persistent file database (`data/interview_iq_db.json`) enabling immediate zero-configuration local execution with seed accounts.

---

## 🚀 Getting Started

### 1. Installation

```bash
cd interview-iq
npm install
```

### 2. Environment Variables

Create `.env.local` (already provided with defaults):

```env
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Add your Gemini API key for live LLM generation
GEMINI_API_KEY=
OPENAI_API_KEY=

# Optional: Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Preloaded Demo Personas

- **Alex Morgan** (`alex.morgan@example.com`): Full Stack Developer persona with 5 completed mock interviews and high technical accuracy scores.
- **Priya Sharma** (`priya.sharma@example.com`): AI/ML Engineer persona with deep neural network and MLOps interview history.
- Switch between them with one click using the demo pill in the top navigation bar!
