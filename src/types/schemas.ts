import { z } from 'zod';

// ==============================================================================
// 1. BOOK UPLOAD & LIBRARY SCHEMAS
// ==============================================================================
export const ALLOWED_FILE_EXTENSIONS = ['pdf', 'epub', 'docx', 'txt'] as const;
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

// Sanitizes filename by stripping directory traversal and non-alphanumeric chars
export function sanitizeFilename(filename: string): string {
  const base = filename.replace(/^.*[\\/]/, ''); // Strip path
  const dotIndex = base.lastIndexOf('.');
  const ext = dotIndex !== -1 ? base.substring(dotIndex) : '';
  const name = dotIndex !== -1 ? base.substring(0, dotIndex) : base;
  const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 100);
  return `${sanitized || 'document'}${ext.toLowerCase()}`;
}

export const BookUploadSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long'),
  author: z.string().max(100, 'Author name too long').default('Curriculum Author'),
  subject: z.string().min(1, 'Subject is required').default('General'),
  hasRightsDeclaration: z.boolean().refine(val => val === true, {
    message: 'You must confirm that you have the right to upload and use this book material.'
  }),
  fileSize: z.number().max(MAX_FILE_SIZE_BYTES, 'File size exceeds maximum allowed 50 MB'),
  fileType: z.enum(ALLOWED_FILE_EXTENSIONS, {
    message: 'Allowed book formats are PDF, EPUB, DOCX, and TXT'
  })
});

export type BookUploadInput = z.infer<typeof BookUploadSchema>;

// Exercise detection schema
export const DetectedExerciseSchema = z.object({
  id: z.string(),
  title: z.string(), // e.g. "Exercise 1.1", "Practice Set 2.1", "Review Questions"
  page: z.number().int().positive(),
  type: z.enum(['exercise', 'practice_problems', 'review_questions', 'problems', 'questions']),
  snippet: z.string().optional(),
  estimatedQuestions: z.number().int().nonnegative().optional()
});
export type DetectedExercise = z.infer<typeof DetectedExerciseSchema>;

// Pipeline status
export const PipelineStatusEnum = z.enum(['uploading', 'extracting', 'indexing', 'ready', 'failed']);
export type PipelineStatus = z.infer<typeof PipelineStatusEnum>;

// Chapter schema - optional exercise fields so existing models stay backward compatible
export const ChapterSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  name: z.string().min(1, 'Chapter name is required'),
  orderIndex: z.number().int().nonnegative(),
  pageStart: z.number().int().positive(),
  pageEnd: z.number().int().positive(),
  contentPreview: z.string().optional(),
  content: z.string().optional(),
  hasExercises: z.boolean().optional(),
  detectedExercises: z.array(DetectedExerciseSchema).optional(),
  exerciseCount: z.number().optional()
});
export type ChapterModel = z.infer<typeof ChapterSchema>;

// Book schema - optional fields for backward compatibility
export const BookModelSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  author: z.string(),
  subject: z.string(),
  fileUrl: z.string(),
  fileType: z.enum(ALLOWED_FILE_EXTENSIONS),
  fileSizeBytes: z.number(),
  status: PipelineStatusEnum,
  totalPages: z.number().int().positive(),
  uploaderName: z.string().optional(),
  originalFilename: z.string().optional(),
  sanitizedFilename: z.string().optional(),
  isScanned: z.boolean().optional(),
  exerciseSectionsCount: z.number().optional(),
  board: z.string().optional(),
  coverGradient: z.string().optional(),
  errorMessage: z.string().optional(),
  chapters: z.array(ChapterSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string().optional()
});
export type BookModel = z.infer<typeof BookModelSchema>;

// Chunk Schema
export const ChunkSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  chapterId: z.string().optional(),
  chapterName: z.string().default('General'),
  exerciseRef: z.string().optional(),
  text: z.string().min(1),
  page: z.number().int().positive(),
  embedding: z.array(z.number()).optional(),
  tokenCount: z.number().optional()
});
export type ChunkModel = z.infer<typeof ChunkSchema>;

// ==============================================================================
// 2. EXAM GENERATION SCHEMAS
// ==============================================================================
export const QuestionTypeEnum = z.enum([
  'mcq',
  'true_false',
  'fill_in_blank',
  'short_answer',
  'long_answer',
  'numerical'
]);
export type QuestionType = z.infer<typeof QuestionTypeEnum>;

export const DifficultyLevelEnum = z.enum(['easy', 'medium', 'hard']);
export type DifficultyLevel = z.infer<typeof DifficultyLevelEnum>;

export const BloomLevelEnum = z.enum(['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']);
export type BloomLevel = z.infer<typeof BloomLevelEnum>;

export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string()
});

export const ExamQuestionSchema = z.object({
  id: z.string(),
  type: QuestionTypeEnum,
  chapterId: z.string(),
  chapterName: z.string(),
  pageRef: z.string().default('Page 1'),
  sourceExerciseRef: z.string().optional(),
  difficulty: DifficultyLevelEnum,
  bloomLevel: BloomLevelEnum,
  marks: z.number().positive(),
  question: z.string().min(5, 'Question text too brief'),
  options: z.array(QuestionOptionSchema).optional(),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().default(''),
  estimatedTimeSec: z.number().int().positive().default(60)
});
export type ExamQuestionModel = z.infer<typeof ExamQuestionSchema>;

export const ExerciseSourceModeEnum = z.enum(['as_is', 'similar', 'mixed']);
export type ExerciseSourceMode = z.infer<typeof ExerciseSourceModeEnum>;

export const ExamConfigSchema = z.object({
  title: z.string().min(2, 'Exam title is required'),
  sourceBookIds: z.array(z.string()).min(1, 'Select at least one source book'),
  sourceChapterIds: z.array(z.string()).min(1, 'Select at least one chapter or all chapters'),
  sourceExerciseIds: z.array(z.string()).optional(),
  exerciseMode: ExerciseSourceModeEnum.optional(),
  totalQuestions: z.number().int().min(1).max(100),
  totalMarks: z.number().int().min(5).max(200),
  questionTypes: z.array(QuestionTypeEnum).min(1, 'Select at least one question type'),
  typeCounts: z.record(QuestionTypeEnum, z.number().int().nonnegative()).optional(),
  marksPerType: z.record(QuestionTypeEnum, z.number().int().positive()).optional(),
  difficultyMode: z.enum(['custom', 'adaptive']).default('custom'),
  difficultyMix: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100)
  }),
  bloomMix: z.record(z.string(), z.number()).optional(),
  timeLimitMinutes: z.number().int().min(5).max(240).default(60),
  negativeMarking: z.boolean().default(false),
  negativeMarkingValue: z.number().default(0.25),
  language: z.string().default('English'),
  focusOnWeakChapters: z.boolean().default(false)
});
export type ExamConfigInput = z.infer<typeof ExamConfigSchema>;

export const ExamModelSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  config: ExamConfigSchema,
  questions: z.array(ExamQuestionSchema),
  totalMarks: z.number(),
  timeLimitMinutes: z.number(),
  createdAt: z.string()
});
export type ExamModel = z.infer<typeof ExamModelSchema>;

// Saved test paper section breakdown
export interface PaperSection {
  id: string;
  name: string; // e.g. "Section A: Multiple Choice Questions"
  questionType: QuestionType;
  instructions: string;
  marksPerQuestion: number;
  totalMarks: number;
  questions: ExamQuestionModel[];
}

export interface SavedTestPaper {
  id: string;
  userId: string;
  title: string;
  bookId?: string;
  bookTitle?: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  exerciseMode: ExerciseSourceMode;
  sections: PaperSection[];
  questions: ExamQuestionModel[];
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// 3. ATTEMPT & PERFORMANCE SCHEMAS
// ==============================================================================
export const AttemptAnswerSchema = z.object({
  id: z.string(),
  attemptId: z.string(),
  questionId: z.string(),
  answer: z.string().default(''),
  isCorrect: z.boolean().default(false),
  marksAwarded: z.number().default(0),
  timeSpentSec: z.number().int().nonnegative().default(0),
  timesChanged: z.number().int().nonnegative().default(0),
  markedReview: z.boolean().default(false),
  difficultyScore: z.number().default(0),
  aiFeedback: z.string().optional()
});
export type AttemptAnswerModel = z.infer<typeof AttemptAnswerSchema>;

export const AttemptModelSchema = z.object({
  id: z.string(),
  examId: z.string(),
  userId: z.string(),
  startedAt: z.string(),
  submittedAt: z.string().optional(),
  score: z.number().default(0),
  total: z.number().default(0),
  timeSpentSeconds: z.number().default(0),
  status: z.enum(['in_progress', 'submitted', 'abandoned']).default('in_progress'),
  answers: z.array(AttemptAnswerSchema).default([]),
  createdAt: z.string()
});
export type AttemptModel = z.infer<typeof AttemptModelSchema>;

// Configurable weights for Difficulty Score
export interface DifficultyScoreWeights {
  wMarks: number;    // default 40
  wTime: number;     // default 30
  wChanges: number;  // default 15
  wSkipped: number;  // default 15
}

export const DEFAULT_DIFFICULTY_WEIGHTS: DifficultyScoreWeights = {
  wMarks: 40,
  wTime: 30,
  wChanges: 15,
  wSkipped: 15
};

// AI Study Plan Schema
export const AIStudyPlanSchema = z.object({
  priorityChapters: z.array(z.string()),
  topicsToRevise: z.array(z.string()),
  suggestedDailyMinutes: z.number(),
  tips: z.array(z.string()).length(3)
});
export type AIStudyPlan = z.infer<typeof AIStudyPlanSchema>;
