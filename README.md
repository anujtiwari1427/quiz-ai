# EduPulse AI — Next-Gen K-12 AI Assessment & Intelligence Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4.7-black?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anujtiwari1427/quiz-ai)

> **EduPulse AI** is a production-grade, dual-sided K-12 assessment and academic intelligence platform tailored for Indian educational boards (**CBSE**, **ICSE**, and **State Boards**). It bridges teachers, students, parents, and school administrators with AI-assisted test authoring, real-time proctored test execution, automated subjective grading, and comprehensive student learning analytics.

---

## 🚀 Key Highlights & Capabilities

- ⚡ **AI-Powered Assessment Authoring**: Draft chapter-wise MCQs, short answer, and analytical questions aligned with board guidelines, complete with marking schemes and rubric blueprints.
- 🛡️ **Zero-Friction, Proctored Student Environment**: Link-based student access (no clunky account creation required). Features anti-cheat safeguards including fullscreen enforcement, tab-switch logging, idle timeouts, and copy-paste interception.
- 📝 **Dual-Engine Auto Grading**: Instant evaluation for objective questions paired with AI rubric scoring for subjective responses, backed by human-in-the-loop review queues.
- 📈 **360° Academic Intelligence & Marks Dashboard**: Granular historical trends, subject mastery heatmaps, early at-risk student detection, and exportable report cards.
- 📖 **Interactive Book Reader ("Read the Book")**: Integrated NCERT/board textbook reader with side-by-side AI explanations, concept simplifications, and key term summaries.
- 🎯 **Question Sets & PYQ Practice Hub**: Filterable question bank with previous years' board questions, real-time practice simulations, and detailed instant result sheets.
- 📑 **Curriculum & Syllabus Progress Tracker**: Chapter-by-chapter weightage tracking, document upload with automatic chapter extraction, and study completion tracking.
- 👨‍👩‍👧 **Parent Engagement Portal**: WhatsApp-first authentication, multi-child tracking, real-time exam notifications, and an AI tutor grounded in the child's past mistakes.
- 🔒 **DPDPA Compliance & Institutional Console**: Role-based access control (RBAC), multi-school analytics, CSV roster imports, and grade change audit logs aligned with India's Digital Personal Data Protection Act.

---

## 🏛️ Architecture & Core Modules

The platform is designed around a modular view-driven architecture managed through a central context state (`AppContext`):

```
├── 🌐 Marketing Landing       # Conversion hero, platform overview, feature demos, and tier comparison
├── 👨‍🏫 Teacher Console        # Test authoring wizard, live proctoring dashboard, grading queue
├── ✍️ Student Test Room       # Secure exam delivery, timed interface, anti-cheat detection, instant submission
├── 👨‍👩‍👦 Parent Portal          # Child progress tracking, attendance overview, personalized AI tutoring
├── 📊 Marks Dashboard         # Comprehensive academic analytics, exam breakdown, printable grade cards
├── 📚 Syllabus Dashboard      # Board curriculum tracking, chapter progress, syllabus document parser
├── 📖 Book Library & Reader   # Digital textbook shelf, split-screen reading, inline AI concept explainer
├── 🎯 Question Sets Hub       # Practice test generator, difficulty-based PYQ sets, test review sheets
└── 🛡️ Admin Console           # School management, bulk CSV rosters, DPDPA compliance & audit logging
```

---

## 🛠️ Technology Stack

| Domain | Technology / Library | Description |
|---|---|---|
| **Core Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Strict type checking, modern component design |
| **Bundler & Tooling** | [Vite 6](https://vitejs.dev/) | Sub-millisecond HMR and optimized production bundles |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/) + Custom Tokens | Modern dark aesthetic with glassmorphism and refined typography |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth layout transitions, micro-interactions, and modal animations |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon set |
| **Effects & Gamification** | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | Visual celebration on exam submission and milestone achievements |
| **Hosting & Deployment** | [Vercel](https://vercel.com/) | Edge network, automatic SSL, and SPA route rewrites |

---

## 📁 Repository Structure

```text
├── index.html                   # HTML5 template with Inter, Outfit & JetBrains Mono typography
├── package.json                 # Project dependencies and npm scripts
├── tailwind.config.js           # Extended design tokens, colors, animations, and glass styles
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Vercel deployment and SPA client-side rewrite rules
├── vite.config.ts               # Vite configuration with alias paths (@/ -> src/)
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Main router shell and dynamic view renderer
│   ├── index.css                # Base design system, custom utilities, scrollbars, and animations
│   ├── types/
│   │   └── index.ts             # Domain models (Tests, Questions, Grades, Syllabus, Books, AuditLogs)
│   ├── context/
│   │   └── AppContext.tsx       # Global application state, active view, and persistence engine
│   ├── services/
│   │   └── storageService.ts    # Local storage persistence for tests, submissions, books, and syllabus
│   ├── mock/
│   │   └── studentFeaturesData.ts # Demo datasets for NCERT books, question sets, marks, and syllabus
│   ├── utils/
│   │   └── gradeUtils.ts        # CBSE/ICSE grading schemes, GPA calculators, and percentage helpers
│   └── components/
│       ├── layout/              # Universal Navigation bar, notifications, and footer
│       ├── marketing/           # Landing page with interactive portals preview
│       ├── teacher/             # Test creation stepper, proctoring grid, grading queue
│       ├── student/             # Timed exam test room with anti-cheat monitoring
│       ├── parent/              # Child academic reports and RAG-based AI tutor
│       ├── marks/               # Marks dashboard, subject cards, and performance trends
│       ├── syllabus/            # Syllabus dashboard, chapter tracker, and syllabus uploader
│       ├── books/               # Book library and split-screen digital reader
│       ├── questions/           # Question sets hub, practice room, and exam result sheet
│       └── admin/               # Institutional metrics, CSV import, and DPDP audit logs
```

---

## 💻 Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- `npm` (version `9.x` or higher) or `pnpm` / `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anujtiwari1427/quiz-ai.git
   cd quiz-ai
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` (or the port specified in terminal output).

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready assets will be compiled into the `dist/` directory.

5. **Preview the production build locally**:
   ```bash
   npm run preview
   ```

---

## 🚢 Deployment

### Deploying to Vercel (1-Click)

The repository includes a ready-to-use [`vercel.json`](./vercel.json) configured for Vite with client-side SPA routing:

1. Push your latest changes to GitHub:
   ```bash
   git push origin main
   ```
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import the repository `anujtiwari1427/quiz-ai`.
4. Vercel will auto-detect the configuration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

### Deploying via Vercel CLI

Alternatively, deploy directly from your local terminal:

```bash
# Login and preview deployment
npx vercel

# Deploy to production
npx vercel --prod
```

---

## 🌟 EduPulse AI Features (v1.2 Release)

### 📚 Feature 1: Upload & Read Books (RAG Vector Store)
- **Multi-Format Ingestion**: Upload PDF, EPUB, DOCX, and TXT files up to 50 MB with strict client and server-side Zod validation.
- **Copyright & Right-to-Use Protection**: Mandatory user certification certifying lawful educational use.
- **Background Ingestion Pipeline**: Asynchronous background lifecycle:
  `Uploading` (20%) → `Extracting` (50%) → `Indexing` (80%) → `Ready` (100%) or `Failed` (with automatic Tesseract OCR fallback for scanned non-selectable PDFs).
- **Chapter Detection & Management**: Automatic regex heading detection (`Chapter \d+`, `Unit \d+`) with an interactive **Chapter Manager** to rename, add, or merge chapters.
- **Vector Embedding & Chunking**: Splits chapters into ~500-800 token chunks with 100-token overlap and vector similarity search.
- **In-App Reader & RAG Chat**: Chapter sidebar, page navigation, keyword search, and an interactive **"Ask this book"** RAG drawer citing exact Chapter + Page, or explicitly reporting when a concept is outside the book.
- **Row-Level Security (RLS)**: Enforces strict user data isolation so students only access their own uploaded books.

### 📝 Feature 2: AI Exam Paper Generator (By User Preference)
- **Granular Customization**: Source book(s) and chapter selector, question types (MCQ with 4 options and plausible distractors, True/False, Fill in blanks, Short answer, Long answer, Numerical), difficulty distribution (Easy / Medium / Hard or Adaptive), Bloom's Taxonomy mix, time limit, negative marking, and weak chapter targeting.
- **RAG Generation Constraint**: Questions are generated strictly from retrieved book chapter chunks.
- **JSON Schema Validation**: Validated against strict Zod schemas with retry logic to ensure marks sum exactly to requested totals.
- **Preview & Edit Screen**: Swap, regenerate, or delete individual questions prior to finalizing.
- **PDF Paper Export**: 1-click export generating a clean examination paper and a separate confidential Teacher Answer Key with rubrics.
- **Active Exam Runner**: Distraction-free exam room with countdown timer, question navigator palette (Answered, Marked for Review, Skipped), autosave, and question-level telemetry (time spent, times changed).
- **Security Rule**: Correct answers are strictly hidden and never exposed to the client prior to final submission.

### 📊 Feature 3: Performance Analysis & Improvement Plan
- **Multi-Factor Difficulty Scoring Formula**:
  $$\text{Difficulty Score} = 40 \times \left(1 - \frac{\text{marks\_awarded}}{\text{marks}}\right) + 30 \times \frac{\min\left(\frac{\text{time\_spent}}{\text{estimatedTime}}, 2\right)}{2} + 15 \times \frac{\min(\text{times\_changed}, 3)}{3} + 15 \times (\text{skipped} \,?\, 1 : 0)$$
  *(Weights are configurable constants; verified via unit tests).*
- **Top 5 Hardest Questions**: Deep-dive review of the most challenging questions faced, showing student answer, correct textbook answer, explanation, time spent, chapter, page reference, and class-wide % accuracy.
- **Chapter-Wise Mastery**: Recharts interactive Bar and Radar charts categorizing chapters as **Weak** (<50%), **Average** (50-75%), or **Strong** (>75%).
- **Targeted Improvement Plan**: Prioritized list of weak chapters detailing exact reasons ("3 of 4 wrong, avg time 2x expected"), missed sub-topics, exact pages to revisit, and a 1-click **"Practice this chapter"** exam generator.
- **AI Study Coaching Plan**: Structured diagnostic sent to LLM returning priority chapters, topics to revise, daily time cadence, and 3 tailored coaching tips distinguishing careless slips vs concept gaps vs time pressure.
- **Progress Over Time**: Historical score trend line chart tracking attempt-over-attempt progress.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (API keys remain server-side only in Vercel Serverless Functions):

```bash
# AI Providers (Server-Side Only)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
ANTHROPIC_API_KEY=sk-ant-your-claude-api-key-here

# Supabase & PostgreSQL with pgvector (Optional for Cloud Persistence)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Cloud Storage
STORAGE_PUBLIC_URL=https://storage.edupulse.internal
```

---

## 🗄️ Database Migrations (PostgreSQL + pgvector)

Run the SQL migration script located at [`supabase/migrations/20261005_edupulse_features.sql`](./supabase/migrations/20261005_edupulse_features.sql) on your Supabase or PostgreSQL instance:

```bash
# Using Supabase CLI
supabase db push

# Or execute directly via psql:
psql -h <host> -U <user> -d <database> -f supabase/migrations/20261005_edupulse_features.sql
```

The migration defines:
- `public.books`: Book metadata, cloud storage URLs, total pages, and status (`uploading`, `extracting`, `indexing`, `ready`, `failed`).
- `public.chapters`: Chapter structure, order index, page ranges.
- `public.chunks`: Text chunks with 1536-dimensional vector embeddings and ivfflat cosine distance indexing.
- `public.exams`: Exam definitions, chapter selections, and configuration JSON.
- `public.exam_questions`: Question stems, Bloom's level, marks, options, server-side correct answers, explanations, and page references.
- `public.attempts`: Exam attempt logs, total scores, time spent, and submission timestamps.
- `public.attempt_answers`: Per-question answer telemetry, correctness, marks awarded, time spent, times changed, review flags, and calculated difficulty scores.
- **Row Level Security (RLS)**: Strictly restricts all read/write operations to authenticated users (`auth.uid() = user_id`).

---

---

## ⚡ Strata AI Learning Platform (Strater-Inspired AI Workspace)

EduPulse now integrates **Strata AI Study OS**, an all-in-one AI study workspace transforming raw media and documents into high-yield active recall systems:

### 📥 1. Omnichannel Ingestion Pipeline
- **YouTube Ingestion**: Extract video metadata, simulate/fetch synchronized timestamped transcripts, and jump directly to key video moments via synchronized chapter anchors.
- **PDF & Academic Papers**: Token calculation, page-by-page chunking, and reading time estimation.
- **Word Documents (DOCX)**: Structured section extraction.
- **PowerPoint Decks (PPTX)**: Slide-by-slide titles and speaker notes decomposition.
- **Web Articles & Research URLs**: Reader-mode clean text extraction.
- **Progressive Background Processing**: Real states (`validating` 15% → `extracting` 40% → `chunking` 70% → `synthesizing` 95% → `ready` 100%).

### 🧠 2. AI Study Synthesizer Studio
- **Executive Summaries**: TL;DR callout, 5 high-yield takeaways, concept cards with real-world analogies, domain glossary, and simulated 3-minute audio briefing.
- **Smart Cornell Notes**: Two-column layout with left recall cues, rich Markdown notes column with diagrams/callouts, and bottom summary area with action items.
- **Interactive Flashcards & 3D Player**: Card flip animation, hint reveals, audio pronunciation, and keyboard navigation (`Space` to flip, `1-4` to rate).
- **SuperMemo SM-2 Spaced Repetition**: Canonical SM-2 algorithm calculating Ease Factors ($EF$), repetitions ($n$), and review intervals ($I$), with a dedicated "Due Today" review queue.
- **Interactive Visual Mind Map**: SVG concept graph with cubic Bezier curves, zoom/pan controls, and click-to-open concept deep-dive drawers.
- **Contextual AI Tutor**: Multi-turn chat strictly grounded in the ingested source with clickable timestamp and page citations, prompt chips ("Explain simply", "Give an analogy"), and model selection.
- **Practice Assessment Quizzes**: MCQs, True/False, and Fill-in-the-blanks with Bloom's Taxonomy ratings, instant grading, and thorough explanations.

### 📚 3. Courses, Analytics & Exports
- **Course Pathways**: Organize sources into syllabus modules with checklist completion tracking.
- **Retention Analytics**: Ebbinghaus forgetting curve mathematical visualization, 7-day study heatmap, and streak tracking.
- **Multi-Format Exports**: 1-click downloads to universal Markdown (`.md`), Anki flashcard decks (`.txt`), high-contrast printable study sheets, and JSON data archives.
- **Bring Your Own Key (BYOK)**: Client-side encrypted API key storage for OpenAI, Anthropic Claude, Google Gemini, and Groq with live ping tests and high-fidelity offline fallback.
- **Multi-Persona Testing**: 1-click test personas for Software Engineering, Medicine (USMLE), Law (Bar Exam), and High School Scholars with isolated data stores.

---

## 🧪 Testing

Run empirical unit tests for both the assessment scoring and the Strater SM-2 spaced repetition engine:

```bash
npm test
```

Expected output:
```text
🧪 Running EduPulse Assessment & Difficulty Scoring Tests...
  ✓ Test 1: Swift perfect answer score = 7.5 (Time factor only)
  ✓ Test 2: Maximum difficulty struggle = 100 (Full penalty capped)
  ✓ Test 3: Custom configurable weights respected (50 marks weight)
  ✓ Test 4: Objective grading for MCQ, True/False, and Numerical tolerance passed

🎉 ALL 4 DIFFICULTY SCORING AND GRADING TESTS PASSED EMPIRICALLY!

🧪 Starting Strata AI Learning Platform Algorithmic Verification Suite...
▶ TEST 1: SuperMemo SM-2 Spaced Repetition Algorithm Validation
  ✓ 1.1 Fresh card rated "good": interval = 1d, repetition = 1
  ✓ 1.2 Second review rated "good": interval = 6d, repetition = 2 (reviewing state)
  ✓ 1.3 Third review rated "easy": interval = 16d, EF boosted to 2.6
  ✓ 1.4 Failure rated "again": repetition resets to 0, interval = 1d
  ✓ 1.5 Minimum ease factor floor is strictly enforced at 1.3
▶ TEST 2: YouTube Video ID & Multi-Format Ingestion Parsing
  ✓ 2.1 Standard watch, youtu.be shortlinks, and embed URLs extracted correctly
▶ TEST 3: Anki Tab-Separated Exporter Compliance
  ✓ 3.1 Anki tab-delimited format with HTML breaks and tags validated
▶ TEST 4: Ebbinghaus Forgetting Curve Mathematical Projection
  ✓ 4.1 Memory decay verified: Unassisted Day 10 (8%) vs SM-2 Spaced Day 30 (94%)

🎉 ALL 4 EMPIRICAL VERIFICATION TESTS PASSED SUCCESSFULLY! 🚀
```

---

## 🔒 Security & Compliance

- **DPDP Act Aligned**: Adheres to the principles of India's Digital Personal Data Protection Act, including parental consent verification and student data minimization.
- **Role-Based Isolation**: Distinct operational domains for School Admins, Subject Teachers, Parents, and Students.
- **Audit Logs**: Comprehensive, tamper-evident logs for grade modifications, score overrides, and data access.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

