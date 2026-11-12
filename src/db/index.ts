import Dexie, { Table } from 'dexie';
import { 
  TextbookRecord, 
  ChapterRecord, 
  TextbookChunk, 
  QuestionItem, 
  PaperBlueprint, 
  SavedPaper, 
  DraftState,
  StorageEstimateInfo
} from '../types';

export class EduPulseDatabase extends Dexie {
  textbooks!: Table<TextbookRecord, string>;
  chapters!: Table<ChapterRecord, string>;
  textbookChunks!: Table<TextbookChunk, string>;
  questionBank!: Table<QuestionItem, string>;
  blueprints!: Table<PaperBlueprint, string>;
  savedPapers!: Table<SavedPaper, string>;
  drafts!: Table<DraftState, string>;
  settings!: Table<{ key: string; value: any }, string>;

  constructor() {
    super('EduPulseLocalDB');

    // Schema v1
    this.version(1).stores({
      textbooks: 'id, title, grade, subject, board, createdAt, updatedAt',
      chapters: 'id, textbookId, chapterNumber, title, startPage, endPage',
      textbookChunks: 'id, textbookId, chapterId, pageNumber',
      questionBank: 'id, text, type, marks, difficulty, bloomLevel, subject, grade, board, chapter, sourceBookId, createdAt',
      blueprints: 'id, name, board, grade, subject, totalMarks, language, isBuiltIn, createdAt, updatedAt',
      savedPapers: 'id, title, blueprintId, grade, subject, board, totalMarks, status, createdAt, updatedAt',
      drafts: 'id, paperId, lastSavedAt',
      settings: 'key'
    });

    // Populate built-in starter blueprints on first creation
    this.on('populate', () => {
      this.populateDefaultBlueprints();
    });
  }

  async populateDefaultBlueprints() {
    const starterBlueprints: PaperBlueprint[] = [
      {
        id: 'bp_cbse_10_science_80m',
        name: 'CBSE Class 10 Science (80 Marks Blueprint)',
        board: 'CBSE',
        grade: 10,
        subject: 'Science',
        examName: 'Annual Board Examination 2026',
        schoolName: 'Central Public School',
        durationMinutes: 180,
        totalMarks: 80,
        generalInstructions: [
          'This question paper consists of 39 questions in 5 sections.',
          'All questions are compulsory. However, internal choices are provided in some questions.',
          'Section A consists of 20 objective type questions carrying 1 mark each.',
          'Section B consists of 6 Very Short questions carrying 2 marks each. Answers to these should be in the range of 30 to 50 words.',
          'Section C consists of 7 Short Answer type questions carrying 3 marks each. Answers to these should be in the range of 50 to 80 words.',
          'Section D consists of 3 Long Answer type questions carrying 5 marks each. Answers to these should be in the range of 80 to 120 words.',
          'Section E consists of 3 source-based/case-based units of assessment of 4 marks each with sub-parts.'
        ],
        sections: [
          {
            id: 'sec_a',
            name: 'Section A',
            title: 'Multiple Choice & Assertion-Reason Questions',
            questionType: 'mcq',
            questionCount: 20,
            marksPerQuestion: 1,
            instructions: 'Questions 1 to 20 are multiple choice questions carrying 1 mark each.',
            sourceMode: 'mix',
            exerciseMode: 'mix'
          },
          {
            id: 'sec_b',
            name: 'Section B',
            title: 'Very Short Answer Questions',
            questionType: 'short_answer',
            questionCount: 6,
            marksPerQuestion: 2,
            instructions: 'Questions 21 to 26 are very short answer questions carrying 2 marks each.',
            sourceMode: 'mix',
            exerciseMode: 'mix'
          },
          {
            id: 'sec_c',
            name: 'Section C',
            title: 'Short Answer Questions',
            questionType: 'short_answer',
            questionCount: 7,
            marksPerQuestion: 3,
            instructions: 'Questions 27 to 33 are short answer questions carrying 3 marks each.',
            sourceMode: 'mix',
            exerciseMode: 'mix'
          },
          {
            id: 'sec_d',
            name: 'Section D',
            title: 'Long Answer Questions',
            questionType: 'long_answer',
            questionCount: 3,
            marksPerQuestion: 5,
            instructions: 'Questions 34 to 36 are long answer questions carrying 5 marks each.',
            sourceMode: 'mix',
            exerciseMode: 'mix'
          },
          {
            id: 'sec_e',
            name: 'Section E',
            title: 'Case-Based Integrated Units',
            questionType: 'case_study',
            questionCount: 3,
            marksPerQuestion: 4,
            instructions: 'Questions 37 to 39 are case study questions carrying 4 marks each.',
            sourceMode: 'mix',
            exerciseMode: 'mix'
          }
        ],
        chapterWeightages: [
          { chapterName: 'Chemical Reactions and Equations', weightagePercent: 12 },
          { chapterName: 'Acids, Bases and Salts', weightagePercent: 12 },
          { chapterName: 'Metals and Non-metals', weightagePercent: 10 },
          { chapterName: 'Life Processes', weightagePercent: 15 },
          { chapterName: 'Control and Coordination', weightagePercent: 10 },
          { chapterName: 'Light - Reflection and Refraction', weightagePercent: 15 },
          { chapterName: 'Electricity', weightagePercent: 14 },
          { chapterName: 'Our Environment', weightagePercent: 12 }
        ],
        difficultySplit: { easy: 30, medium: 50, hard: 20 },
        bloomSplit: { remember: 25, understand: 35, apply: 25, analyze: 15 },
        language: 'English',
        isBuiltIn: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'bp_cbse_10_math_80m',
        name: 'CBSE Class 10 Mathematics Standard (80 Marks)',
        board: 'CBSE',
        grade: 10,
        subject: 'Mathematics',
        examName: 'Annual Board Examination 2026',
        schoolName: 'Delhi Model Senior Secondary School',
        durationMinutes: 180,
        totalMarks: 80,
        generalInstructions: [
          'This question paper contains 38 questions divided into 5 Sections A, B, C, D and E.',
          'Section A comprises 20 MCQs of 1 mark each.',
          'Section B comprises 5 Short Answer Type-I (SA-I) questions of 2 marks each.',
          'Section C comprises 6 Short Answer Type-II (SA-II) questions of 3 marks each.',
          'Section D comprises 4 Long Answer (LA) questions of 5 marks each.',
          'Section E comprises 3 Case Based integrated units of assessment of 4 marks each.'
        ],
        sections: [
          { id: 'm_sec_a', name: 'Section A', title: 'Multiple Choice Questions', questionType: 'mcq', questionCount: 20, marksPerQuestion: 1 },
          { id: 'm_sec_b', name: 'Section B', title: 'Short Answer I', questionType: 'short_answer', questionCount: 5, marksPerQuestion: 2 },
          { id: 'm_sec_c', name: 'Section C', title: 'Short Answer II', questionType: 'short_answer', questionCount: 6, marksPerQuestion: 3 },
          { id: 'm_sec_d', name: 'Section D', title: 'Long Answer', questionType: 'long_answer', questionCount: 4, marksPerQuestion: 5 },
          { id: 'm_sec_e', name: 'Section E', title: 'Case Study Assessment', questionType: 'case_study', questionCount: 3, marksPerQuestion: 4 }
        ],
        chapterWeightages: [
          { chapterName: 'Real Numbers', weightagePercent: 8 },
          { chapterName: 'Polynomials', weightagePercent: 10 },
          { chapterName: 'Quadratic Equations', weightagePercent: 12 },
          { chapterName: 'Arithmetic Progressions', weightagePercent: 10 },
          { chapterName: 'Triangles', weightagePercent: 15 },
          { chapterName: 'Coordinate Geometry', weightagePercent: 10 },
          { chapterName: 'Trigonometry', weightagePercent: 15 },
          { chapterName: 'Statistics and Probability', weightagePercent: 20 }
        ],
        difficultySplit: { easy: 30, medium: 50, hard: 20 },
        language: 'English',
        isBuiltIn: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'bp_msbshse_9_algebra_40m',
        name: 'Maharashtra State Board Class 9 Algebra (40 Marks)',
        board: 'State Board (Maharashtra)',
        grade: 9,
        subject: 'Mathematics (Part 1 - Algebra)',
        examName: 'First Semester Evaluation',
        schoolName: 'Balmohan Vidyamandir',
        durationMinutes: 120,
        totalMarks: 40,
        generalInstructions: [
          'All questions are compulsory.',
          'Use of a calculator is not allowed.',
          'The numbers to the right of the questions indicate full marks.',
          'In case of MCQs, only the first attempt will be evaluated and will be given credit.'
        ],
        sections: [
          { id: 'mh_q1a', name: 'Q.1 (A)', title: 'Choose the correct alternative (MCQs)', questionType: 'mcq', questionCount: 4, marksPerQuestion: 1 },
          { id: 'mh_q1b', name: 'Q.1 (B)', title: 'Solve the following sub-questions', questionType: 'short_answer', questionCount: 4, marksPerQuestion: 1 },
          { id: 'mh_q2a', name: 'Q.2 (A)', title: 'Complete activities (Any 2 of 3)', questionType: 'short_answer', questionCount: 2, marksPerQuestion: 2, internalChoiceCount: 3 },
          { id: 'mh_q2b', name: 'Q.2 (B)', title: 'Solve any 4 of 5 sub-questions', questionType: 'short_answer', questionCount: 4, marksPerQuestion: 2, internalChoiceCount: 5 },
          { id: 'mh_q3', name: 'Q.3', title: 'Solve any 2 of 4 sub-questions', questionType: 'short_answer', questionCount: 2, marksPerQuestion: 3, internalChoiceCount: 4 },
          { id: 'mh_q4', name: 'Q.4', title: 'Solve any 2 of 3 questions (Higher Order)', questionType: 'long_answer', questionCount: 2, marksPerQuestion: 4, internalChoiceCount: 3 },
          { id: 'mh_q5', name: 'Q.5', title: 'Creative/Applied sub-question (Any 1 of 2)', questionType: 'short_answer', questionCount: 1, marksPerQuestion: 3, internalChoiceCount: 2 }
        ],
        chapterWeightages: [
          { chapterName: 'Sets', weightagePercent: 25 },
          { chapterName: 'Real Numbers', weightagePercent: 25 },
          { chapterName: 'Polynomials', weightagePercent: 25 },
          { chapterName: 'Ratio and Proportion', weightagePercent: 25 }
        ],
        difficultySplit: { easy: 40, medium: 40, hard: 20 },
        language: 'English',
        isBuiltIn: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    await this.blueprints.bulkPut(starterBlueprints);
  }
}

export const db = new EduPulseDatabase();

/**
 * Ensures the default blueprints exist (in case DB was created before populate listener)
 */
export async function ensureDefaultBlueprints() {
  const count = await db.blueprints.count();
  if (count === 0) {
    await db.populateDefaultBlueprints();
  }
}

/**
 * Persist IndexedDB storage to prevent browser eviction
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      return isPersisted;
    } catch (e) {
      console.warn('Storage persist request failed:', e);
      return false;
    }
  }
  return false;
}

/**
 * Get current storage usage and quota
 */
export async function getStorageEstimate(): Promise<StorageEstimateInfo> {
  let usage = 0;
  let quota = 0;
  let isPersistent = false;

  if (navigator.storage && navigator.storage.estimate) {
    try {
      const est = await navigator.storage.estimate();
      usage = est.usage || 0;
      quota = est.quota || 0;
    } catch (e) {
      console.warn('Failed to estimate storage:', e);
    }
  }

  if (navigator.storage && navigator.storage.persisted) {
    try {
      isPersistent = await navigator.storage.persisted();
    } catch {
      isPersistent = false;
    }
  }

  const usagePercent = quota > 0 ? (usage / quota) * 100 : 0;
  const isLowStorage = usagePercent > 80 || (quota > 0 && quota - usage < 100 * 1024 * 1024);

  return {
    usage,
    quota,
    usagePercent: Math.min(100, Math.round(usagePercent * 10) / 10),
    isPersistent,
    isLowStorage
  };
}

/**
 * Completely wipe all user data from IndexedDB
 */
export async function deleteAllLocalData(): Promise<void> {
  await Promise.all([
    db.textbooks.clear(),
    db.chapters.clear(),
    db.textbookChunks.clear(),
    db.questionBank.clear(),
    db.blueprints.clear(),
    db.savedPapers.clear(),
    db.drafts.clear(),
    db.settings.clear()
  ]);
  // Re-populate clean default blueprints
  await db.populateDefaultBlueprints();
}
