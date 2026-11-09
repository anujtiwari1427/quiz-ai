-- ==============================================================================
-- Migration: 20261105_textbook_exercises_and_papers.sql
-- Description: Adds exercise detection metadata to chapters/books and supports
--              generating, structuring, and storing test papers from textbook exercises.
-- ==============================================================================

-- 1. Extend Chapters with Exercise Tagging and Structure
ALTER TABLE IF EXISTS public.chapters
  ADD COLUMN IF NOT EXISTS has_exercises BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS detected_exercises_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS exercise_count INTEGER NOT NULL DEFAULT 0;

-- 2. Extend Books with Uploader Name, Sanitize Status, and Structure Tag
ALTER TABLE IF EXISTS public.books
  ADD COLUMN IF NOT EXISTS uploader_name TEXT DEFAULT 'Teacher / Educator',
  ADD COLUMN IF NOT EXISTS original_filename TEXT,
  ADD COLUMN IF NOT EXISTS sanitized_filename TEXT,
  ADD COLUMN IF NOT EXISTS is_scanned BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS exercise_sections_count INTEGER NOT NULL DEFAULT 0;

-- 3. Extend Exams with Exercise Generation Mode & Blueprint
ALTER TABLE IF EXISTS public.exams
  ADD COLUMN IF NOT EXISTS exercise_mode VARCHAR(30) DEFAULT 'mixed' CHECK (exercise_mode IN ('as_is', 'similar', 'mixed')),
  ADD COLUMN IF NOT EXISTS selected_exercise_tags JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60,
  ADD COLUMN IF NOT EXISTS sections_config JSONB DEFAULT '[]'::jsonb;

-- 4. Extend Exam Questions with Exercise Grounding Metadata
ALTER TABLE IF EXISTS public.exam_questions
  ADD COLUMN IF NOT EXISTS is_exercise_grounded BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS exercise_source_ref TEXT,
  ADD COLUMN IF NOT EXISTS source_chunk_id UUID REFERENCES public.chunks(id) ON DELETE SET NULL;

-- 5. Saved Test Papers Table for Reopening, Duplicating & Online Testing
CREATE TABLE IF NOT EXISTS public.saved_test_papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    book_title TEXT,
    subject TEXT NOT NULL DEFAULT 'General',
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    total_marks NUMERIC(6, 2) NOT NULL DEFAULT 50.0,
    exercise_mode VARCHAR(30) NOT NULL DEFAULT 'mixed',
    sections JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. [{ name: "Section A - MCQs", instructions: "...", marks: 10, questions: [...] }]
    answer_key_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_test_papers_user_id ON public.saved_test_papers(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_test_papers_book_id ON public.saved_test_papers(book_id);
