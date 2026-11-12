# EduPulse AI Architecture Documentation

## 1. Overview & Architectural Principles

EduPulse AI is architected from the ground up as a **100% local-first, zero-cloud-database web application** for educators. It adheres to three strict architectural laws:

1. **User Data Remains On-Device**: All textbook documents, extracted text chunks, parsed question bank items, blueprints, drafts, and exported papers are stored strictly inside the user's browser environment (IndexedDB) and optionally synced to their physical disk via the Chromium File System Access API.
2. **Deterministic Arithmetic Over LLM Guesswork**: Language models are treated solely as natural language content generators for individual question text, answers, and marking rubrics. Section totals, overall paper marks, choice counts, and chapter weightages are validated and calculated deterministically in TypeScript. The LLM is never permitted to dictate the structural or mathematical balance of the examination.
3. **Resilient Offline Fallback**: In the absence of an internet connection or AI API key, the system seamlessly fulfills paper blueprint slots directly from the local IndexedDB Question Bank.

---

## 2. Data Model & IndexedDB Schema (Dexie.js v4)

Database: `EduPulseLocalDB` (Version 1)

### Tables & Primary Keys

| Table | Primary Key | Indexed Fields | Description |
|---|---|---|---|
| `textbooks` | `id` (string) | `title`, `grade`, `subject`, `board`, `createdAt` | Metadata and original PDF `Blob` of textbooks |
| `chapters` | `id` (string) | `textbookId`, `chapterNumber`, `title` | Chapter records with start/end page ranges and exercise sections |
| `textbookChunks` | `id` (string) | `textbookId`, `chapterId`, `chapterName` | Overlapping semantic text chunks (~600 tokens) with page numbers |
| `questionBank` | `id` (string) | `subject`, `grade`, `chapter`, `type`, `difficulty`, `bloomLevel` | Granular question items with options, answers, and marking rubrics |
| `blueprints` | `id` (string) | `name`, `board`, `grade`, `subject`, `isBuiltIn`, `createdAt` | Saved exam patterns specifying section structures, marks, and weightages |
| `savedPapers` | `id` (string) | `title`, `grade`, `subject`, `board`, `status`, `createdAt`, `updatedAt` | Generated exam papers with questions, sets (A/B/C), and answer keys |
| `drafts` | `id` (string) | `type`, `updatedAt` | Debounced autosave drafts for recovery on browser crash/refresh |
| `settings` | `key` (string) | `key` | Local preferences: BYOK API keys, library directory handles, theme |

---

## 3. Storage Hierarchy & Redundancy

```
[ Teacher Device ]
       │
       ├──► 1. Primary Store: IndexedDB (Dexie.js)
       │       • navigator.storage.persist() requested at startup
       │       • Stores text, structured JSON, and raw Blobs
       │       • Real-time quota monitoring via navigator.storage.estimate()
       │
       ├──► 2. Local Disk Mirror: File System Access API (Chrome/Edge)
       │       • User selects "EduPulse Library" once
       │       • DirectoryHandle stored in IndexedDB settings table
       │       • Directory structure automatically maintained:
       │           /Textbooks
       │           /QuestionBanks
       │           /Papers/<grade>-<subject>/
       │           /Exports
       │
       └──► 3. Portable Archive: JSZip Backup & Restore
               • One-click export of full database to compressed .zip
               • Embedded manifest.json with table counts & checksums
               • Cross-browser fallback for Safari and Firefox
```

---

## 4. Ingestion & Chunking Pipeline

Textbook processing is performed entirely client-side without freezing the UI thread:

1. **Document Validation**: Client-side inspection of MIME type and file size.
2. **Page-by-Page Extraction**: `pdfjs-dist` iterates through document pages, extracting text and tracking page numbers.
3. **Scanned Page Detection & OCR Fallback**: If a page contains fewer than 25 characters of extractable text, it is identified as a scanned image and routed through `tesseract.js` (supporting English, Hindi, and Marathi models).
4. **Chapter & Exercise Recognition**: Regex parsers identify chapter headings (`Chapter 1`, `Unit 2`, `Paath 3`) and exercise blocks (`Exercises 1.1`, `Practice Set 2.3`).
5. **Semantic Chunking**: Extracted text is split into chunks of ~600 tokens with 100-token overlaps, preserving textbook ID, chapter title, and page references for citation.
6. **BM25 Search Indexing**: Chunks are indexed in-memory using `MiniSearch` for fast multi-field lexical and BM25 retrieval without external vector services.

---

## 5. Question Bank Parsing & Deduplication

1. **Discrete Item Parsing**: Files containing PYQs (Previous Year Questions) or question lists are parsed into discrete `QuestionItem` objects using delimiter and pattern matching.
2. **Tagging & Metadata**: Each question is assigned topic, question type (MCQ, Short, Long, True/False), marks, difficulty, and Bloom taxonomy level.
3. **Jaccard Similarity Deduplication**:
   $$\text{Similarity}(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
   Token-based Jaccard similarity is computed over normalized word sets. Pairs exceeding the 0.75 threshold are flagged as duplicates, allowing teachers to prune repetitions.

---

## 6. Paper Generation Pipeline

The generation process executes in four distinct phases:

```
[ Blueprint ] ──► [ 1. Deterministic Validation ]
                         │
                         ▼
                  [ 2. Slot Allocation ]
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
  [ Question Bank Match ]        [ Missing Slots ]
  • Filter by chapter/type       • MiniSearch BM25 Chunk Retrieval
  • Dedupe against paper         • LLM Prompt with Strict Zod Schema
                                 • JSON Auto-Repair (Trailing commas, MCQs)
         │                               │
         └───────────────┬───────────────┘
                         ▼
                  [ 3. Paper Assembly ]
                  • Section aggregation
                  • Marks reconciliation check
                         │
                         ▼
                  [ 4. Multi-Set Generation ]
                  • Set A: Standard sequence
                  • Set B: Shuffled questions & options
                  • Set C: Alternative option permutations
                  • Synchronized Answer Keys
```

### MCQ Invariant Enforcement
To prevent common LLM output defects:
- Every MCQ is validated to contain **exactly 4 options**.
- If fewer options are returned, the engine generates placeholder alternatives.
- The engine guarantees **exactly 1 correct answer** (`isCorrect: true`), resetting anomalous outputs where multiple or zero options were flagged.

---

## 7. Export Pipeline

Exports are rendered completely on the client side:
- **Microsoft Word (.docx)**: Generated via the `docx` library with roll number boxes, school headers, general instructions, section dividers, and right-aligned marks. Separate files are created for the Question Paper and the Model Answer Key with Marking Rubrics.
- **Print-Ready PDF**: Uses clean browser print stylesheets with embedded `Noto Sans Devanagari` and `Plus Jakarta Sans` Google fonts to ensure crisp rendering of Devanagari characters (Hindi/Marathi) across desktop printers and PDF drivers.
- **Paper JSON**: Standardized schema for archiving, sharing, and re-importing.
