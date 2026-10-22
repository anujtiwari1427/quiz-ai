-- ==============================================================================
-- EduPulse AI Assessments: PostgreSQL + pgvector Migration Schema
-- Features: Upload & Read Books, AI Exam Generator, Performance Analysis & Improvement
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ------------------------------------------------------------------------------
-- 1. BOOKS & LIBRARY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    author TEXT DEFAULT 'Unknown Author',
    subject TEXT DEFAULT 'General',
    file_url TEXT NOT NULL,
    file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('pdf', 'epub', 'docx', 'txt')),
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes <= 52428800), -- Max 50 MB
    status VARCHAR(20) NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'extracting', 'indexing', 'ready', 'failed')),
    total_pages INTEGER DEFAULT 1,
    cover_gradient TEXT DEFAULT 'from-indigo-600 via-purple-700 to-slate-900',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chapters detected or configured for the book
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    page_start INTEGER NOT NULL DEFAULT 1,
    page_end INTEGER NOT NULL DEFAULT 1,
    content_preview TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Text Chunks with 1536-dimensional OpenAI/Claude embeddings for RAG
CREATE TABLE IF NOT EXISTS public.chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    chapter_name TEXT NOT NULL DEFAULT 'General',
    text TEXT NOT NULL,
    page INTEGER NOT NULL DEFAULT 1,
    token_count INTEGER DEFAULT 0,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast Vector Similarity Index (Cosine Distance)
CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON public.chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS chunks_book_id_idx ON public.chunks(book_id);
CREATE INDEX IF NOT EXISTS chunks_chapter_id_idx ON public.chunks(chapter_id);

-- ------------------------------------------------------------------------------
-- 2. EXAMS & QUESTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    source_book_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    source_chapter_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_marks NUMERIC(6, 2) NOT NULL DEFAULT 20.0,
    time_limit_minutes INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    chapter_id UUID,
    chapter_name TEXT DEFAULT 'General',
    type VARCHAR(30) NOT NULL CHECK (type IN ('mcq', 'true_false', 'fill_in_blank', 'short_answer', 'long_answer', 'numerical')),
    difficulty VARCHAR(15) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    bloom_level VARCHAR(20) NOT NULL CHECK (bloom_level IN ('Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create')),
    marks NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
    question TEXT NOT NULL,
    options_json JSONB, -- For MCQ: [{ "id": "opt_1", "text": "..." }, ...]
    correct_answer TEXT NOT NULL, -- Kept server-side, never exposed to student before submit
    explanation TEXT,
    page_ref TEXT,
    estimated_time_sec INTEGER DEFAULT 60,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. ATTEMPTS & ANSWERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    score NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    total NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'abandoned')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attempt_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
    answer TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    marks_awarded NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    time_spent_sec INTEGER NOT NULL DEFAULT 0,
    times_changed INTEGER NOT NULL DEFAULT 0,
    marked_review BOOLEAN NOT NULL DEFAULT FALSE,
    difficulty_score NUMERIC(6, 2) DEFAULT 0.0,
    ai_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Each user can strictly only read and write their own data.
-- ------------------------------------------------------------------------------
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- Books RLS
CREATE POLICY "Users can manage own books" ON public.books
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Chapters RLS
CREATE POLICY "Users can manage own book chapters" ON public.chapters
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.books WHERE books.id = chapters.book_id AND books.user_id = auth.uid())
    );

-- Chunks RLS
CREATE POLICY "Users can manage own book chunks" ON public.chunks
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.books WHERE books.id = chunks.book_id AND books.user_id = auth.uid())
    );

-- Exams RLS
CREATE POLICY "Users can manage own exams" ON public.exams
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Exam Questions RLS
CREATE POLICY "Users can access exam questions for their exams" ON public.exam_questions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.exams WHERE exams.id = exam_questions.exam_id AND exams.user_id = auth.uid())
    );

-- Attempts RLS
CREATE POLICY "Users can manage own attempts" ON public.attempts
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Attempt Answers RLS
CREATE POLICY "Users can manage own attempt answers" ON public.attempt_answers
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.attempts WHERE attempts.id = attempt_answers.attempt_id AND attempts.user_id = auth.uid())
    );

-- ------------------------------------------------------------------------------
-- 5. VECTOR SEARCH HELPER FUNCTION (RAG)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION match_book_chunks(
    p_book_id UUID,
    p_embedding VECTOR(1536),
    p_match_count INT DEFAULT 5,
    p_similarity_threshold FLOAT DEFAULT 0.25
)
RETURNS TABLE (
    id UUID,
    chapter_id UUID,
    chapter_name TEXT,
    text TEXT,
    page INTEGER,
    similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.chapter_id,
        c.chapter_name,
        c.text,
        c.page,
        1 - (c.embedding <=> p_embedding) AS similarity
    FROM public.chunks c
    WHERE c.book_id = p_book_id
      AND 1 - (c.embedding <=> p_embedding) > p_similarity_threshold
    ORDER BY c.embedding <=> p_embedding
    LIMIT p_match_count;
END;
$$;
