import { z } from 'zod';

// ==============================================================================
// 1. SOURCE INGESTION TYPES & SCHEMAS
// ==============================================================================
export type SourceType = 'youtube' | 'pdf' | 'docx' | 'pptx' | 'article' | 'text';

export const SourceTypeEnum = z.enum(['youtube', 'pdf', 'docx', 'pptx', 'article', 'text']);

export type IngestionStatus = 'idle' | 'validating' | 'extracting' | 'analyzing' | 'chunking' | 'synthesizing' | 'ready' | 'failed';

export interface YouTubeTimestampItem {
  timestamp: string; // "02:15"
  seconds: number;
  label: string;
  summary?: string;
}

export interface IngestedSource {
  id: string;
  userId: string;
  title: string;
  sourceType: SourceType;
  sourceUrl?: string;
  author?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  wordCount: number;
  tokenCount: number;
  readingTimeMinutes: number;
  status: IngestionStatus;
  progressPercentage: number;
  statusMessage?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  courseId?: string;
  tags: string[];
  // Raw content / transcript
  rawText: string;
  timestamps?: YouTubeTimestampItem[];
  slides?: { slideNumber: number; title: string; content: string }[];
  pages?: { pageNumber: number; content: string }[];
}

// Zod Ingestion Validation Schema
export const SourceIngestionInputSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long'),
  sourceType: SourceTypeEnum,
  sourceUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  content: z.string().min(10, 'Content must contain at least 10 characters'),
  author: z.string().max(100).optional(),
  tags: z.array(z.string()).default([]),
  courseId: z.string().optional()
});

export type SourceIngestionInput = z.infer<typeof SourceIngestionInputSchema>;

// ==============================================================================
// 2. AI STUDY ARTIFACTS: SUMMARIES
// ==============================================================================
export interface ConceptCard {
  id: string;
  name: string;
  complexity: 'Foundational' | 'Intermediate' | 'Advanced';
  oneLineSummary: string;
  inDepthExplanation: string;
  analogy: string;
  relatedTerms: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  context: string;
}

export interface StudySummary {
  id: string;
  sourceId: string;
  userId: string;
  tldr: string;
  executiveSummary: string;
  keyTakeaways: { id: string; text: string; important: boolean }[];
  concepts: ConceptCard[];
  glossary: GlossaryTerm[];
  estimatedStudyTimeMinutes: number;
  difficultyRating: 'Beginner' | 'Intermediate' | 'Mastery';
  generatedAt: string;
}

// ==============================================================================
// 3. SMART NOTES (CORNELL METHOD)
// ==============================================================================
export interface CornellNoteCue {
  id: string;
  cueQuestion: string;
  referenceAnchor: string;
  tags: string[];
}

export interface SmartNotes {
  id: string;
  sourceId: string;
  userId: string;
  title: string;
  cues: CornellNoteCue[];
  notesMarkdown: string;
  summary: string;
  actionItems: string[];
  keyFormulas?: string[];
  lastEditedAt: string;
}

// ==============================================================================
// 4. FLASHCARDS & SPACED REPETITION (SM-2)
// ==============================================================================
export type CardRating = 'again' | 'hard' | 'good' | 'easy'; // 1, 2, 3, 4

export type MasteryState = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface Flashcard {
  id: string;
  deckId: string;
  sourceId: string;
  front: string;
  back: string;
  hint?: string;
  citation?: string; // e.g. "YouTube 04:12" or "Page 7"
  tags: string[];
  // SM-2 Spaced Repetition Parameters
  repetitionNumber: number; // n
  intervalDays: number; // I
  easeFactor: number; // EF (default 2.5)
  nextReviewDate: string; // ISO Date YYYY-MM-DD
  lastReviewedAt?: string;
  lastRating?: CardRating;
  masteryState: MasteryState;
  reviewCount: number;
}

export interface FlashcardDeck {
  id: string;
  userId: string;
  sourceId?: string;
  courseId?: string;
  title: string;
  description: string;
  cards: Flashcard[];
  totalCards: number;
  dueTodayCount: number;
  masteredCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// 5. INTERACTIVE MIND MAP (CONCEPT GRAPH)
// ==============================================================================
export interface MindMapNode {
  id: string;
  label: string;
  summary: string;
  category: 'core' | 'primary_branch' | 'sub_concept' | 'detail';
  parentId?: string;
  color?: string;
  expanded?: boolean;
  depth: number;
  x?: number;
  y?: number;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface MindMapData {
  id: string;
  sourceId: string;
  userId: string;
  rootNodeId: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  generatedAt: string;
}

// ==============================================================================
// 6. INTERACTIVE QUIZZES
// ==============================================================================
export type StudioQuizQuestionType = 'mcq' | 'true_false' | 'fill_blank';

export interface StudioQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface StudioQuizQuestion {
  id: string;
  type: StudioQuizQuestionType;
  prompt: string;
  options?: StudioQuizOption[];
  correctAnswer: string;
  explanation: string;
  citation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bloomsLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze';
}

export interface StudioQuiz {
  id: string;
  sourceId: string;
  userId: string;
  title: string;
  questions: StudioQuizQuestion[];
  passingScorePercentage: number;
  timeLimitMinutes: number;
  generatedAt: string;
}

export interface StudioQuizAttempt {
  id: string;
  quizId: string;
  sourceId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  completedAt: string;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

// ==============================================================================
// 7. CONTEXTUAL AI TUTOR
// ==============================================================================
export interface TutorCitation {
  sourceId: string;
  sourceTitle: string;
  sourceType: SourceType;
  anchor: string; // e.g. "03:45" or "Page 12"
  quote: string;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  citations?: TutorCitation[];
  suggestedFollowups?: string[];
  modelUsed?: string;
}

export interface TutorSession {
  id: string;
  userId: string;
  sourceId: string;
  title: string;
  messages: TutorMessage[];
  createdAt: string;
}

// ==============================================================================
// 8. COURSES & STUDY PATHS
// ==============================================================================
export interface CourseModule {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  sourceIds: string[];
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  colorGradient: string;
  targetCompletionDate?: string;
  modules: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// 9. LEARNING ANALYTICS
// ==============================================================================
export interface DailyStudyLog {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  cardsReviewed: number;
  quizzesCompleted: number;
  sourcesIngested: number;
}

export interface RetentionDataPoint {
  day: number;
  unassistedRetention: number; // standard forgetting curve %
  spacedRepetitionRetention: number; // optimized retention %
}

export interface UserLearningAnalytics {
  userId: string;
  totalStudyTimeMinutes: number;
  currentStreakDays: number;
  longestStreakDays: number;
  totalCardsReviewed: number;
  totalCardsMastered: number;
  quizAverageAccuracy: number;
  sourcesIngestedCount: number;
  dailyLogs: DailyStudyLog[];
  retentionCurve: RetentionDataPoint[];
  topicProficiency: { topic: string; score: number }[];
}

// ==============================================================================
// 10. USER AUTH, PROFILE & SUBSCRIPTIONS
// ==============================================================================
export type UserPersonaId = 'med_student' | 'cs_engineer' | 'law_student' | 'high_school';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'student' | 'professional' | 'educator' | 'admin';
  studyGoal: string;
  preferredModel: 'gpt-4o' | 'claude-3-5-sonnet' | 'gemini-1-5-pro' | 'gemini-2-0-flash' | 'groq-llama-3-70b' | 'ollama';
  hasByokKeys: {
    openai: boolean;
    anthropic: boolean;
    gemini: boolean;
    groq: boolean;
    ollama: boolean;
  };
  subscriptionPlan: 'free' | 'pro' | 'campus';
  subscriptionStatus: 'active' | 'trialing' | 'canceled';
  subscriptionRenewalDate: string;
  monthlyTokenUsage: number;
  maxMonthlyTokens: number;
}

export interface ByokApiKeys {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  geminiApiKey?: string;
  groqApiKey?: string;
  ollamaUrl?: string; // e.g. http://localhost:11434
  ollamaModel?: string; // e.g. llama3, mistral, phi3
  activeProvider?: 'gemini' | 'openai' | 'anthropic' | 'groq' | 'ollama' | 'auto';
}

export interface SubscriptionTierDetails {
  id: 'free' | 'pro' | 'campus';
  name: string;
  badge?: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  maxSources: number;
  maxTokensPerMonth: number;
  aiModelsAllowed: string[];
  exportFormats: string[];
  isPopular?: boolean;
}
