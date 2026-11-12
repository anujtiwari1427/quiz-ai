# EduPulse AI — Migration & Local-First Transformation Changelog

## Summary of Changes
This release transitions EduPulse AI from a legacy full-stack prototype with scattered mock data, serverless endpoints, and student/parent portals into a dedicated, production-ready, **100% local-first teacher exam paper generation suite**.

---

## 🗑️ Cleaned Up & Removed
In accordance with Step 1 of the product specification, the following out-of-scope modules, mock datasets, and tooling leftovers were completely removed from the codebase:

1. **Tooling & Redundant Artifacts**:
   - Removed `.agent/`, `.agents/`, `.gemini/`, `.gsd/`, `adapters/`, `supabase/`.
   - Removed `GSD-STYLE.md`, `full-build-prompt-master.md`, `model_capabilities.yaml`.
   - Removed 7 legacy binary PDFs from `textbooks/` (freed ~150MB of repo bloat; added to `.gitignore`).
2. **Out-of-Scope Student, Parent & Admin Portals**:
   - Removed `src/components/parent/` (ParentPortal, AITutorDrawer, WhatsAppAuthModal).
   - Removed `src/components/admin/` (AdminConsole, BulkRosterImport, DPDPAuditLogs).
   - Removed `src/components/student/` (ProctorGuard, StudentTestRoom, ResultDiagnosticSheet).
   - Removed `src/components/attendance/` (SmartAttendanceDashboard).
   - Removed `src/components/marks/` (MarksDashboard, StudentScoreUploader).
   - Removed `src/components/syllabus/` (SyllabusDashboard).
   - Removed `src/components/exams/pw/` (PhysicsWallah clone tabs and leaderboards).
   - Removed `src/components/studio/` (FlashcardStudio, MindMapVisualizer, SpacedRepetitionHub, QuizPlayer).
   - Removed `src/components/marketing/` (MarketingLanding, PricingSection, SecurityTrust).
3. **Dead Backend & Mock Files**:
   - Removed serverless endpoints in `api/books/` and `api/exams/`.
   - Removed mock files in `src/mock/` (`curriculumData.ts`, `initialData.ts`, `pwTestData.ts`, `qpMockQuestions.ts`, `studentFeaturesData.ts`).
   - Removed obsolete services in `src/services/` (`smartAttendanceService.ts`, `studentScoreService.ts`, `gradingAndAnalysisService.ts`, `sm2Service.ts`, `straterStorageService.ts`, `pdfStorageService.ts`).

---

## 🚀 Added & Implemented (Local-First Architecture)

1. **Local-Only Database (`src/db/index.ts`)**:
   - Initialized Dexie.js v4 database (`EduPulseLocalDB`) with versioned schemas and migrations.
   - 8 specialized tables: `textbooks`, `chapters`, `textbookChunks`, `questionBank`, `blueprints`, `savedPapers`, `drafts`, `settings`.
   - Pre-seeded built-in blueprints for CBSE Class 10 Science, CBSE Class 10 Math, and Maharashtra Board Class 9 Algebra.
   - Implemented `requestPersistentStorage()`, `getStorageEstimate()`, and `deleteAllLocalData()`.
2. **File System Access API & Redundancy (`src/services/fileSystemService.ts`)**:
   - Chrome/Edge directory picker for "EduPulse Library" folder.
   - Organized auto-save folder layout: `/Textbooks`, `/QuestionBanks`, `/Papers/<class>-<subject>/`, `/Exports`.
   - Cross-browser JSZip full backup generation and restore mechanism with schema verification.
   - Periodic backup reminder prompt (every 7 days or >= 3 papers created).
3. **In-Browser Ingestion Pipeline (`src/services/ingestionService.ts`)**:
   - Page-by-page PDF extraction using `pdfjs-dist`.
   - Automatic low-text page detection (< 25 chars) and `tesseract.js` OCR fallback for English, Hindi, and Marathi.
   - Chapter detection and exercise heading identification using verified regexes.
   - Semantic text chunker (~600 tokens with 100-token overlap).
   - In-memory `MiniSearch` BM25 search index for retrieval without server vector databases.
   - Question bank parser with token-based Jaccard similarity deduplication.
4. **Deterministic Blueprint Builder (`src/services/blueprintService.ts`, `src/components/blueprint/BlueprintBuilderView.tsx`)**:
   - Strict code-level arithmetic validation for section question counts, marks, and choice options.
   - Validation blocking generation if section totals do not equal total marks or weightages do not equal 100%.
   - Interactive UI with live arithmetic balance pills.
5. **BYOK AI Provider Service (`src/services/aiProviderService.ts`)**:
   - Client-side direct API callers for Google Gemini 2.0, OpenAI GPT-4o, and Anthropic Claude 3.5 Sonnet.
   - Secure IndexedDB key storage with "Test Key" ping verification.
   - Zod schema validation (`GeneratedQuestionSchema`) with JSON auto-repair for trailing commas.
   - Invariant enforcement: exactly 4 options and 1 correct answer for MCQs.
   - Real-time token and cost estimator.
6. **Paper Generator & Multi-Set Engine (`src/services/paperGeneratorService.ts`)**:
   - Hybrid slot allocation: fills slots from Question Bank first, uses BM25 textbook chunks + AI for remainder.
   - Multi-set generator (Sets A, B, C) with question and option shuffling and synchronized answer keys.
   - Offline fallback synthesis when offline or without API keys.
7. **Paper Editor & Professional Exporter (`src/components/editor/PaperEditorView.tsx`, `src/services/paperExportService.ts`)**:
   - Inline text, marks, and rubric editing.
   - Swap from bank, AI regenerate, reorder, delete, undo/redo.
   - Debounced 1-second autosave to IndexedDB with "Saved locally ✓" indicator.
   - Export to print-ready PDF with `Noto Sans Devanagari` font embedding for Hindi/Marathi.
   - Export to Microsoft Word (.docx) for Question Paper and Answer Key.
   - Export to Paper JSON.
8. **Saved Papers Hub (`src/components/papers/SavedPapersHub.tsx`)**:
   - Search and filter by subject, class, board, school, and exam name.
   - Actions: Open in Editor, Duplicate, Quick Export (PDF/DOCX/JSON), Delete, Reuse Blueprint.
9. **Settings Modal (`src/components/settings/SettingsModal.tsx`)**:
   - BYOK API key manager with test button.
   - File System Access folder picker status.
   - Storage quota bar with usage breakdown and low storage warnings.
   - One-click ZIP backup and restore.
   - "Delete all my data" with confirmation.
10. **Progressive Web App (PWA)**:
    - Web manifest (`public/manifest.webmanifest`) and offline service worker (`public/sw.js`).
11. **Testing & CI**:
    - Vitest unit tests in `src/__tests__/`: 22 passed across blueprint validation, MCQ repair, dedupe, regex extraction, and backup ZIP parsing.
    - GitHub Actions CI workflow in `.github/workflows/ci.yml`.
    - Vercel security headers configured in `vercel.json`.

---

## ⚠️ Notes on Exclusions & Browser Limitations
- **File System Access API Browser Support**: Currently supported natively in Chromium browsers (Google Chrome, Microsoft Edge, Opera, Brave). On Apple Safari and Mozilla Firefox, the app automatically falls back to browser downloads and the built-in ZIP Backup/Restore mechanism.
- **Tesseract.js OCR Language Models**: Tesseract OCR language weights for English, Hindi, and Marathi are fetched client-side on-demand and cached in browser storage for subsequent offline use.
