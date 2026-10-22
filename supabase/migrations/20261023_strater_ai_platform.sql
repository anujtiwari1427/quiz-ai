-- ==============================================================================
-- Strata AI Learning Platform: Complete PostgreSQL + pgvector Migration Schema
-- Inspired by Strater: Omnichannel Ingestion, Summaries, Smart Notes, Flashcards,
-- SuperMemo SM-2 Spaced Repetition, Interactive Mind Maps, Contextual AI Tutor,
-- Courses, Learning Analytics, Subscriptions & Per-User RLS Isolation
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES & BYOK CREDENTIALS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'professional', 'educator', 'admin')),
    study_goal TEXT,
    preferred_model VARCHAR(50) NOT NULL DEFAULT 'claude-3-5-sonnet',
    subscription_plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'campus')),
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'trialing', 'canceled')),
    subscription_renewal_date DATE,
    monthly_token_usage BIGINT NOT NULL DEFAULT 0,
    max_monthly_tokens BIGINT NOT NULL DEFAULT 100000,
    encrypted_openai_key TEXT,
    encrypted_anthropic_key TEXT,
    encrypted_gemini_key TEXT,
    encrypted_groq_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. WORKSPACES & COURSES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strata_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'General',
    icon_name VARCHAR(50) DEFAULT 'BookOpen',
    color_gradient TEXT DEFAULT 'from-blue-600 via-indigo-600 to-purple-800',
    target_completion_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.strata_course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.strata_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. OMNICHANNEL INGESTED SOURCES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strata_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.strata_courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('youtube', 'pdf', 'docx', 'pptx', 'article', 'text')),
    source_url TEXT,
    author TEXT DEFAULT 'Instructor',
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    word_count INTEGER NOT NULL DEFAULT 0,
    token_count INTEGER NOT NULL DEFAULT 0,
    reading_time_minutes INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'ready' CHECK (status IN ('idle', 'validating', 'extracting', 'analyzing', 'chunking', 'synthesizing', 'ready', 'failed')),
    progress_percentage INTEGER NOT NULL DEFAULT 100,
    status_message TEXT,
    error_message TEXT,
    tags TEXT[] DEFAULT ARRAY['High-Yield']::TEXT[],
    raw_text TEXT NOT NULL,
    timestamps_json JSONB DEFAULT '[]'::JSONB,
    slides_json JSONB DEFAULT '[]'::JSONB,
    pages_json JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vector chunk embeddings for RAG & Contextual Tutor
CREATE TABLE IF NOT EXISTS public.strata_source_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.strata_sources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL DEFAULT 0,
    text_content TEXT NOT NULL,
    anchor_reference TEXT, -- e.g. "04:12" or "Page 5"
    token_count INTEGER NOT NULL DEFAULT 0,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS strata_chunks_embedding_idx ON public.strata_source_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS strata_chunks_source_idx ON public.strata_source_chunks(source_id);

-- ------------------------------------------------------------------------------
-- 4. STUDY SUMMARIES & CONCEPT CARDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strata_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL UNIQUE REFERENCES public.strata_sources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tldr TEXT NOT NULL,
    executive_summary TEXT NOT NULL,
    key_takeaways_json JSONB NOT NULL DEFAULT '[]'::JSONB,
    concepts_json JSONB NOT NULL DEFAULT '[]'::JSONB,
    glossary_json JSONB NOT NULL DEFAULT '[]'::JSONB,
    estimated_study_time_minutes INTEGER NOT NULL DEFAULT 15,
    difficulty_rating VARCHAR(20) NOT NULL DEFAULT 'Intermediate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. SMART CORNELL NOTES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strata_smart_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL UNIQUE REFERENCES public.strata_sources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    cues_json JSONB NOT NULL DEFAULT '[]'::JSONB,
    notes_markdown TEXT NOT NULL,
    summary TEXT NOT NULL,
    action_items TEXT[] DEFAULT ARRAY[]::TEXT[],
    key_formulas TEXT[] DEFAULT ARRAY[]::TEXT[],
    last_edited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. FLASHCARDS & SM-2 SPACED REPETITION ENGINE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strata_flashcard_decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES public.strata_sources(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.strata_flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deck_id UUID NOT NULL REFERENCES public.strata_flashcard_decks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    hint TEXT,
    citation TEXT,
    tags TEXT[] DEFAULT ARRAY['General']::TEXT[],
    -- SuperMemo SM-2 Parameters
    repetition_number INTEGER NOT NULL DEFAULT 0,
    interval_days INTEGER NOT NULL DEFAULT 1,
    ease_factor NUMERIC(4, 2) NOT NULL DEFAULT 2.50,
    next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_reviewed_at TIMESTAMPTZ,
    last_rating VARCHAR(10) CHECK (last_rating IN ('again', 'hard', 'good', 'easy')),
    mastery_state VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (mastery_state IN ('new', 'learning', 'reviewing', 'mastered')),
    review_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS strata_cards_review_date_idx ON public.strata_flashcards(user_id, next_review_date);

-- ------------------------------------------------------------------------------
-- 7. INTERACTIVE VISUAL MIND MAPS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strata_mindmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL UNIQUE REFERENCES public.strata_sources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    root_node_id TEXT NOT NULL,
    nodes_json JSONB NOT NULL DEFAULT '[]'::JSONB,
    edges_json JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. INTERACTIVE QUIZZES & ATTEMPTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strata_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.strata_sources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    passing_score_percentage INTEGER NOT NULL DEFAULT 70,
    time_limit_minutes INTEGER NOT NULL DEFAULT 10,
    questions_json JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.strata_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.strata_quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    max_score NUMERIC(5, 2) NOT NULL,
    percentage INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    answers_json JSONB NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. CONTEXTUAL AI TUTOR SESSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strata_tutor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.strata_sources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Source Chat',
    messages_json JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. LEARNING ANALYTICS & ACTIVITY LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.strata_daily_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_date DATE NOT NULL DEFAULT CURRENT_DATE,
    minutes_studied INTEGER NOT NULL DEFAULT 0,
    cards_reviewed INTEGER NOT NULL DEFAULT 0,
    quizzes_completed INTEGER NOT NULL DEFAULT 0,
    sources_ingested INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, study_date)
);

-- ------------------------------------------------------------------------------
-- 11. ROW-LEVEL SECURITY (RLS) POLICIES FOR SECURE DATA ISOLATION
-- ------------------------------------------------------------------------------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_source_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_smart_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_mindmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strata_daily_analytics ENABLE ROW LEVEL SECURITY;

-- Dynamic RLS Policies: Authenticated users can ONLY view/modify their own records
CREATE POLICY "Users access own profile" ON public.user_profiles FOR ALL TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users access own courses" ON public.strata_courses FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own sources" ON public.strata_sources FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own chunks" ON public.strata_source_chunks FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own summaries" ON public.strata_summaries FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own notes" ON public.strata_smart_notes FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own decks" ON public.strata_flashcard_decks FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own cards" ON public.strata_flashcards FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own mindmaps" ON public.strata_mindmaps FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own quizzes" ON public.strata_quizzes FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own quiz attempts" ON public.strata_quiz_attempts FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own tutor sessions" ON public.strata_tutor_sessions FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users access own daily analytics" ON public.strata_daily_analytics FOR ALL TO authenticated USING (auth.uid() = user_id);
