# Step 0: Audit Report — EduPulse AI

## 1. What Works
- **Canvas Paper Studio (`PaperBuilderStudio.tsx`)**: Good baseline UI for multi-section examination papers (Section A-E) with real-time marks tracking and section tabs.
- **AI Paper Generation Logic (`aiPaperService.ts`, `liveAiService.ts`)**: Direct integration with Google Gemini 2.0 API with structured prompts for CBSE/ICSE blueprint generation.
- **Textbook Ingestion (`textbookExtractionService.ts`)**: PDF page extraction via `pdfjs-dist` and exercise section pattern matching.
- **Algorithms & Utils (`difficultyScoring.ts`, `sm2Service.ts`)**: Working scoring algorithms with automated unit tests.
- **Typography & Styling**: Clean Marklab aesthetic with `TASA Orbiter Deck` and `Instrument Serif`, responsive Tailwind styling.

## 2. What is Mock / Fake
- **`src/mock/*`**:
  - `studentFeaturesData.ts`: Fake student marks, fake NCERT books, fake PYQs.
  - `initialData.ts`: Hardcoded mock teacher test questions.
  - `pwTestData.ts`: Mock PhysicsWallah test series and leaderboard data.
  - `qpMockQuestions.ts`: Hardcoded CBSE mock questions.
  - `curriculumData.ts`: Hardcoded syllabus structures.
- **Mock Storage Services (`src/services/storageService.ts`, `straterStorageService.ts`)**:
  - Relies on memory and `localStorage` with hardcoded seed data, without persistent IndexedDB schemas.
- **Serverless API Placeholders (`api/books/*`, `api/exams/*`)**:
  - Vercel functions with simulated delay and mock payloads, conflicting with the 100% local-first goal.
- **Supabase Migrations (`supabase/migrations/*`)**:
  - Cloud database schemas that are completely unnecessary for a local-first application.

## 3. What is Dead Code / Out of Scope
- **Parent Portal (`src/components/parent/*`)**: WhatsApp auth, parent progress drawer.
- **Admin Console (`src/components/admin/*`)**: Bulk CSV roster import, DPDPA audit logs.
- **Student Exam & Proctoring (`src/components/student/*`, `src/components/teacher/LiveProctoringHUD.tsx`)**: Anti-cheat fullscreen enforcement, tab-switch logging, webcam HUD.
- **Strata / Quizgecko Extras (`src/components/studio/*`)**: Flashcards, Mind maps, Course studio, Billing tiers, Spaced repetition hub.
- **Attendance & Gradebooks (`src/components/attendance/*`, `src/components/marks/*`)**: Daily student attendance and marks uploaders.
- **PhysicsWallah Clones (`src/components/exams/pw/*`)**: Leaderboards, video solution tabs.
- **Tooling Leftovers**: `.agent/`, `.agents/`, `.gemini/`, `.gsd/`, `GSD-STYLE.md`, `full-build-prompt-master.md`, `model_capabilities.yaml`, `adapters/`.
- **Heavy Blobs (`textbooks/`)**: 7 checked-in PDF files (>50MB) that must be removed.

## 4. Scope Cleanup Plan
- **Delete** all tooling leftovers, mock datasets, unneeded subcomponents, legacy files, and `textbooks/`.
- **Retain & Refactor ONLY the Teacher Paper-Generation Flow**:
  `Upload (Textbooks & Question Banks) -> Extract & Tag (Web Worker + OCR) -> Blueprint Builder -> Generate (Bank + Grounded AI) -> Split Editor -> Export (PDF, DOCX, JSON) -> Saved Papers Hub`.
- **Implement 100% Local-First Dexie IndexedDB Store** with versioned migrations, File System Access API with Chrome/Edge folder sync, fallback backup/restore ZIP, autosave, PWA offline manifest, and BYOK AI provider handling.
