// EduPulse AI — Local-First Teacher Paper-Generation Platform Domain Types

export type BoardType = 
  | 'CBSE' 
  | 'ICSE' 
  | 'State Board (Maharashtra)' 
  | 'State Board (Karnataka)' 
  | 'State Board (Tamil Nadu)'
  | 'General';

export type QuestionType = 
  | 'mcq' 
  | 'true_false' 
  | 'fill_blank' 
  | 'short_answer' 
  | 'long_answer' 
  | 'case_study' 
  | 'assertion_reason'
  | 'numerical';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type BloomsLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

export type SupportedLanguage = 'English' | 'Hindi' | 'Marathi';

export type AppView = 
  | 'library'           // Textbooks & Uploads
  | 'chapter-manager'   // Edit chapters and page ranges
  | 'question-bank'     // Ingest, review & tag questions
  | 'blueprints'        // Manage & create blueprints
  | 'generator'         // Run paper generation
  | 'editor'            // Split-screen canvas paper editor
  | 'saved-papers'      // Hub of saved papers
  | 'settings';         // AI keys, File System Folder, backup/restore, delete all

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuestionItem {
  id: string;
  text: string;
  type: QuestionType;
  marks: number;
  difficulty: DifficultyLevel;
  bloomLevel?: BloomsLevel;
  options?: QuestionOption[];
  answer?: string;
  explanation?: string;
  subject?: string;
  grade?: number;
  board?: BoardType;
  chapter?: string;
  topic?: string;
  sourceBookId?: string;
  sourceBookTitle?: string;
  sourcePage?: number;
  tags?: string[];
  createdAt?: number;
  updatedAt?: number;
}

export interface SectionBlueprint {
  id: string;
  name: string;               // e.g., "Section A", "Section B"
  title: string;              // e.g., "Multiple Choice Questions"
  questionType: QuestionType;
  questionCount: number;
  marksPerQuestion: number;
  internalChoiceCount?: number; // e.g. "Attempt any 5 of 6"
  instructions?: string;
  sourceMode?: 'bank_only' | 'generate_new' | 'mix';
  exerciseMode?: 'as_is' | 'similar' | 'mix';
}

export interface ChapterWeightage {
  chapterId?: string;
  chapterName: string;
  weightagePercent: number; // 0 - 100
  targetMarks?: number;
}

export interface DifficultySplit {
  easy: number;    // percentage, e.g. 30
  medium: number;  // percentage, e.g. 50
  hard: number;    // percentage, e.g. 20
}

export interface BloomSplit {
  remember: number;
  understand: number;
  apply: number;
  analyze: number;
}

export interface PaperBlueprint {
  id: string;
  name: string;
  board: BoardType;
  grade: number;
  subject: string;
  examName: string;            // e.g. "Term 1 Periodic Assessment"
  schoolName: string;
  schoolLogoBlob?: Blob;
  schoolLogoDataUrl?: string;
  date?: string;
  durationMinutes: number;
  totalMarks: number;
  generalInstructions: string[];
  sections: SectionBlueprint[];
  chapterWeightages: ChapterWeightage[];
  difficultySplit: DifficultySplit;
  bloomSplit?: BloomSplit;
  language: SupportedLanguage;
  isBuiltIn?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface PaperQuestion extends QuestionItem {
  sectionId: string;
  questionNumber: number;
  subNumber?: string;
  isInternalChoice?: boolean;
  choicePairId?: string; // Links questions in "OR" choices
}

export interface PaperSection {
  id: string;
  name: string;
  title: string;
  instructions?: string;
  questionType: QuestionType;
  marksPerQuestion: number;
  totalMarks: number;
  questions: PaperQuestion[];
}

export interface PaperSet {
  setName: 'Set A' | 'Set B' | 'Set C';
  sections: PaperSection[];
  answerKey: Record<string, string>; // questionId -> answer
}

export interface SavedPaper {
  id: string;
  title: string;
  blueprintId?: string;
  grade: number;
  subject: string;
  board: BoardType;
  examName: string;
  schoolName: string;
  durationMinutes: number;
  totalMarks: number;
  generalInstructions: string[];
  language: SupportedLanguage;
  sections: PaperSection[];
  sets?: PaperSet[];
  answerKey?: Record<string, { answer: string; explanation?: string; marks: number }>;
  status: 'draft' | 'final';
  createdAt: number;
  updatedAt: number;
}

export interface TextbookRecord {
  id: string;
  title: string;
  grade: number;
  subject: string;
  board: BoardType;
  totalPages: number;
  originalFileName: string;
  fileBlob?: Blob;
  language?: SupportedLanguage;
  createdAt: number;
  updatedAt: number;
}

export interface ChapterRecord {
  id: string;
  textbookId: string;
  chapterNumber: number;
  title: string;
  startPage: number;
  endPage: number;
  exerciseSections: {
    title: string;
    startPage: number;
    endPage: number;
  }[];
}

export interface TextbookChunk {
  id: string;
  textbookId: string;
  chapterId?: string;
  chapterTitle?: string;
  pageNumber: number;
  content: string;
  tokenCount: number;
}

export interface DraftState {
  id: string;
  paperId?: string;
  paper: SavedPaper;
  lastSavedAt: number;
}

export interface AIProviderConfig {
  provider: 'gemini' | 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
  useProxy?: boolean;
  proxyUrl?: string;
}

export interface StorageEstimateInfo {
  usage: number; // bytes
  quota: number; // bytes
  usagePercent: number; // 0-100
  isPersistent: boolean;
  isLowStorage: boolean; // >80% used or <100MB free
}
