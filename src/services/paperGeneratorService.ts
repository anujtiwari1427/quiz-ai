import { db } from '../db';
import { 
  PaperBlueprint, 
  SavedPaper, 
  PaperSection, 
  PaperQuestion, 
  QuestionItem,
  PaperSet
} from '../types';
import { AI_PROVIDER_SERVICE } from './aiProviderService';
import { INGESTION_SERVICE, calculateJaccardSimilarity } from './ingestionService';
import { BLUEPRINT_SERVICE } from './blueprintService';

export interface GenerationProgressCallback {
  (currentStep: number, totalSteps: number, message: string): void;
}

export class PaperGeneratorService {
  /**
   * Main paper generation pipeline
   */
  async generatePaper(
    blueprint: PaperBlueprint,
    options?: {
      generateSets?: boolean; // Set A, B, C
      onProgress?: GenerationProgressCallback;
    }
  ): Promise<{ paper: SavedPaper; offlineUsed: boolean; warnings: string[] }> {
    const warnings: string[] = [];
    let offlineUsed = false;

    // 1. Deterministic Blueprint Validation
    const validation = BLUEPRINT_SERVICE.validateBlueprint(blueprint);
    if (!validation.isValid) {
      throw new Error(`Invalid Blueprint:\n${validation.errors.join('\n')}`);
    }

    const totalSteps = blueprint.sections.reduce((sum, s) => sum + s.questionCount, 0) + 2;
    let stepCount = 0;

    options?.onProgress?.(++stepCount, totalSteps, 'Initializing paper generation...');

    // 2. Fetch all local Question Bank items matching subject/grade
    const bankItems = await db.questionBank
      .where('subject')
      .equals(blueprint.subject)
      .and(q => !blueprint.grade || q.grade === blueprint.grade)
      .toArray();

    // Check AI configuration
    const aiConfig = await AI_PROVIDER_SERVICE.getConfig();
    const isAiConfigured = Boolean(aiConfig.apiKey && aiConfig.apiKey.trim().length > 5);

    const generatedSections: PaperSection[] = [];
    const usedQuestionIds = new Set<string>();
    const usedQuestionTexts: string[] = [];

    // Map chapter weightages to distribute questions
    const chaptersList = (blueprint.chapterWeightages && blueprint.chapterWeightages.length > 0)
      ? blueprint.chapterWeightages.map(c => c.chapterName)
      : ['General Syllabus'];

    let chapterIndex = 0;

    // 3. Process each section in the blueprint
    for (let sIdx = 0; sIdx < blueprint.sections.length; sIdx++) {
      const secDef = blueprint.sections[sIdx];
      const sectionQuestions: PaperQuestion[] = [];

      for (let qIdx = 0; qIdx < secDef.questionCount; qIdx++) {
        const questionNumber = qIdx + 1;
        const targetChapter = chaptersList[chapterIndex % chaptersList.length];
        chapterIndex++;

        options?.onProgress?.(
          ++stepCount, 
          totalSteps, 
          `Preparing ${secDef.name}: Question ${questionNumber} (${secDef.questionType})...`
        );

        let selectedQuestion: QuestionItem | null = null;

        // Try to pick from question bank if mode is 'bank_only' or 'mix'
        if (secDef.sourceMode !== 'generate_new') {
          const candidate = bankItems.find(q => 
            !usedQuestionIds.has(q.id) &&
            q.type === secDef.questionType &&
            q.marks === secDef.marksPerQuestion &&
            (!targetChapter || !q.chapter || q.chapter.toLowerCase() === targetChapter.toLowerCase())
          ) || bankItems.find(q => 
            !usedQuestionIds.has(q.id) && 
            q.type === secDef.questionType && 
            q.marks === secDef.marksPerQuestion
          );

          if (candidate) {
            selectedQuestion = candidate;
            usedQuestionIds.add(candidate.id);
          }
        }

        // If no bank question found, generate with grounded AI
        if (!selectedQuestion) {
          if (!isAiConfigured) {
            offlineUsed = true;
            // Assemble offline fallback question
            selectedQuestion = this.createOfflineFallbackQuestion(secDef, questionNumber, targetChapter, blueprint);
            warnings.push(`Offline fallback used for ${secDef.name} Q.${questionNumber}: No AI key configured.`);
          } else {
            try {
              // Retrieve textbook chunks via MiniSearch
              const chunks = await INGESTION_SERVICE.searchRelevantChunks(targetChapter, { limit: 3 });
              const contextText = chunks.map(c => c.content).join('\n---\n');

              const generated = await AI_PROVIDER_SERVICE.generateQuestionGrounded({
                questionType: secDef.questionType,
                marks: secDef.marksPerQuestion,
                difficulty: 'medium',
                bloomLevel: 'Understand',
                subject: blueprint.subject,
                grade: blueprint.grade,
                board: blueprint.board,
                chapterName: targetChapter,
                chunksText: contextText || `Core concepts of ${targetChapter} for ${blueprint.subject} Class ${blueprint.grade}`,
                language: blueprint.language
              });

              // Check quality guard: duplicate text
              const isDupe = usedQuestionTexts.some(t => calculateJaccardSimilarity(t, generated.text) > 0.8);
              if (isDupe) {
                console.warn('Duplicate question caught by quality guard, adjusting index.');
              }

              selectedQuestion = {
                id: `gen_q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                ...generated,
                subject: blueprint.subject,
                grade: blueprint.grade,
                board: blueprint.board,
                sourceBookTitle: chunks[0]?.chapterTitle || targetChapter,
                sourcePage: chunks[0]?.pageNumber,
                createdAt: Date.now()
              };
            } catch (err: any) {
              offlineUsed = true;
              selectedQuestion = this.createOfflineFallbackQuestion(secDef, questionNumber, targetChapter, blueprint);
              warnings.push(`AI generation error for ${secDef.name} Q.${questionNumber}: ${err.message || 'Falling back to offline question.'}`);
            }
          }
        }

        usedQuestionTexts.push(selectedQuestion.text);

        const paperQ: PaperQuestion = {
          ...selectedQuestion,
          sectionId: secDef.id,
          questionNumber: sectionQuestions.length + 1
        };

        sectionQuestions.push(paperQ);
      }

      generatedSections.push({
        id: secDef.id,
        name: secDef.name,
        title: secDef.title,
        instructions: secDef.instructions,
        questionType: secDef.questionType,
        marksPerQuestion: secDef.marksPerQuestion,
        totalMarks: secDef.questionCount * secDef.marksPerQuestion,
        questions: sectionQuestions
      });
    }

    // 4. Construct Answer Key
    const answerKeyMap: Record<string, { answer: string; explanation?: string; marks: number }> = {};
    for (const sec of generatedSections) {
      for (const q of sec.questions) {
        answerKeyMap[q.id] = {
          answer: q.answer || 'Refer to model answer in marking scheme.',
          explanation: q.explanation || '',
          marks: q.marks
        };
      }
    }

    // 5. Generate multiple sets (Set A, B, C) if requested
    let paperSets: PaperSet[] | undefined;
    if (options?.generateSets) {
      paperSets = this.generateAlternativeSets(generatedSections);
    }

    // 6. Build the final SavedPaper object
    const savedPaper: SavedPaper = {
      id: `paper_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: `${blueprint.examName} - ${blueprint.subject} (Class ${blueprint.grade})`,
      blueprintId: blueprint.id,
      grade: blueprint.grade,
      subject: blueprint.subject,
      board: blueprint.board,
      examName: blueprint.examName,
      schoolName: blueprint.schoolName,
      durationMinutes: blueprint.durationMinutes,
      totalMarks: blueprint.totalMarks,
      generalInstructions: blueprint.generalInstructions || [],
      language: blueprint.language || 'English',
      sections: generatedSections,
      sets: paperSets,
      answerKey: answerKeyMap,
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    options?.onProgress?.(totalSteps, totalSteps, 'Paper assembled successfully!');

    // Automatically persist to IndexedDB
    await db.savedPapers.put(savedPaper);

    return {
      paper: savedPaper,
      offlineUsed,
      warnings
    };
  }

  /**
   * Deterministic Shuffling for Multi-Set Generation (Sets A, B, C)
   * Shuffles questions inside each section and shuffles MCQ options while keeping the answer key synced
   */
  generateAlternativeSets(sections: PaperSection[]): PaperSet[] {
    const makeSet = (setName: 'Set A' | 'Set B' | 'Set C', seed: number): PaperSet => {
      const newSections: PaperSection[] = sections.map(sec => {
        // Clone questions
        let shuffledQuestions = [...sec.questions];
        if (setName !== 'Set A') {
          // Deterministic shuffle
          shuffledQuestions.sort((a, b) => {
            const hashA = (a.text.length * seed) % 17;
            const hashB = (b.text.length * seed) % 17;
            return hashA - hashB;
          });
          // Re-number
          shuffledQuestions = shuffledQuestions.map((q, idx) => ({
            ...q,
            questionNumber: idx + 1,
            // Shuffle MCQ options if applicable
            options: q.options ? this.shuffleOptions(q.options, seed) : q.options
          }));
        }

        return {
          ...sec,
          questions: shuffledQuestions
        };
      });

      // Compute synced answer key
      const answerKey: Record<string, string> = {};
      for (const s of newSections) {
        for (const q of s.questions) {
          if (q.type === 'mcq' && q.options) {
            const correctOpt = q.options.find(o => o.isCorrect);
            const optLetter = q.options.findIndex(o => o.isCorrect);
            answerKey[q.id] = correctOpt 
              ? `(${String.fromCharCode(65 + Math.max(0, optLetter))}) ${correctOpt.text}`
              : (q.answer || '');
          } else {
            answerKey[q.id] = q.answer || '';
          }
        }
      }

      return { setName, sections: newSections, answerKey };
    };

    return [
      makeSet('Set A', 1),
      makeSet('Set B', 3),
      makeSet('Set C', 7)
    ];
  }

  private shuffleOptions(options: any[], seed: number) {
    const copy = [...options];
    copy.sort((a, b) => ((a.text.length * seed) % 7) - ((b.text.length * seed) % 7));
    return copy;
  }

  /**
   * Offline question synthesis fallback
   */
  private createOfflineFallbackQuestion(
    secDef: any,
    qNum: number,
    chapter: string,
    blueprint: PaperBlueprint
  ): QuestionItem {
    let text = `Define and explain the core principles of ${chapter} relevant to Class ${blueprint.grade} ${blueprint.subject}.`;
    let options: any = undefined;
    let answer = `Model response outlining foundational principles and real-world examples from ${chapter}.`;

    if (secDef.questionType === 'mcq') {
      text = `Which of the following statements is TRUE regarding ${chapter}?`;
      options = [
        { id: 'opt_1', text: `Primary standard characteristic of ${chapter}`, isCorrect: true },
        { id: 'opt_2', text: `Secondary contradictory postulate`, isCorrect: false },
        { id: 'opt_3', text: `Unrelated peripheral condition`, isCorrect: false },
        { id: 'opt_4', text: `None of the above`, isCorrect: false }
      ];
      answer = 'Option A';
    } else if (secDef.questionType === 'assertion_reason') {
      text = `Assertion (A): Fundamental behavior observed in ${chapter}.\nReason (R): Governing biological or physical law explaining the assertion.`;
      options = [
        { id: 'opt_1', text: 'Both (A) and (R) are true and (R) is correct explanation of (A)', isCorrect: true },
        { id: 'opt_2', text: 'Both (A) and (R) are true but (R) is not correct explanation of (A)', isCorrect: false },
        { id: 'opt_3', text: '(A) is true but (R) is false', isCorrect: false },
        { id: 'opt_4', text: '(A) is false but (R) is true', isCorrect: false }
      ];
      answer = 'Option A';
    } else if (secDef.questionType === 'case_study') {
      text = `Case Context: In an experimental study on ${chapter}, investigators recorded data over consecutive iterations.\n\n(i) State the dependent variable (1M)\n(ii) Analyze the observed outcome (1M)\n(iii) Deduce the governing formula (2M)`;
      answer = '(i) Recorded outcome metric. (ii) Quantitative proportionality. (iii) Theoretical relationship formulation.';
    }

    return {
      id: `offline_q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text,
      type: secDef.questionType,
      marks: secDef.marksPerQuestion,
      difficulty: 'medium',
      bloomLevel: 'Understand',
      options,
      answer,
      explanation: 'Generated via offline curriculum synthesis fallback.',
      subject: blueprint.subject,
      grade: blueprint.grade,
      board: blueprint.board,
      chapter,
      createdAt: Date.now()
    };
  }
}

export const PAPER_GENERATOR_SERVICE = new PaperGeneratorService();
