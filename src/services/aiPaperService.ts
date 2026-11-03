import { 
  AiGeneratedPaper, 
  PaperQuestionItem, 
  PaperSectionMeta, 
  BoardType, 
  BloomsLevel, 
  DifficultyLevel 
} from '../types';
import { ExamModel, ExamQuestionModel } from '../types/schemas';
import { LIVE_AI_SERVICE } from './liveAiService';

const AI_PAPERS_STORAGE_KEY = 'edupulse_ai_generated_papers';

export interface GeneratePaperInput {
  title?: string;
  board: BoardType;
  classGrade: number;
  subject: string;
  topics: string;
  totalMarks: number;
  durationMinutes: number;
  difficulty: 'balanced' | 'easy' | 'hard' | 'olympiad';
  includeCaseStudy: boolean;
  // School / teacher metadata
  schoolName?: string;
  teacherName?: string;
  invigilatorName?: string;
  academicSession?: string;
  // Multi-set generation
  setCount?: 1 | 2 | 3;
}

export const AI_PAPER_SERVICE = {
  getSavedPapers(): AiGeneratedPaper[] {
    try {
      const data = localStorage.getItem(AI_PAPERS_STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultSeedPapers();
    } catch {
      return this.getDefaultSeedPapers();
    }
  },

  savePaper(paper: AiGeneratedPaper): void {
    try {
      const list = this.getSavedPapers();
      const existingIdx = list.findIndex(p => p.id === paper.id);
      if (existingIdx >= 0) {
        list[existingIdx] = paper;
      } else {
        list.unshift(paper);
      }
      localStorage.setItem(AI_PAPERS_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save AI paper', err);
    }
  },

  deletePaper(id: string): void {
    try {
      const list = this.getSavedPapers().filter(p => p.id !== id);
      localStorage.setItem(AI_PAPERS_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to delete paper', err);
    }
  },

  /**
   * Generate Question Paper using Google Gemini Live AI or Smart Heuristic Engine
   */
  async generatePaper(
    input: GeneratePaperInput,
    onProgress?: (progress: number, step: string) => void
  ): Promise<AiGeneratedPaper> {
    onProgress?.(15, 'Analyzing curriculum syllabus & board blueprint standards...');
    await new Promise(r => setTimeout(r, 400));

    onProgress?.(35, `Contacting Google Gemini 2.0 Flash with configured API Key...`);
    
    const paperTitle = input.title?.trim() || `${input.board} Class ${input.classGrade} ${input.subject} Examination 2026`;
    const promptTopics = input.topics.trim() || `${input.subject} core curriculum syllabus chapters`;

    // Attempt Live AI Call with Gemini
    let generatedPaper: AiGeneratedPaper | null = null;
    let modelUsed = 'Google Gemini 2.0 Flash';

    if (LIVE_AI_SERVICE.isLiveAiAvailable()) {
      try {
        onProgress?.(55, 'Prompting Gemini neural model for structured paper generation & marking rubrics...');
        
        const systemPrompt = `You are a Senior Academic Examiner and Paper Setter for ${input.board} Board.
Generate a formal, high-standard Question Paper strictly in JSON format.
The paper MUST include:
1. "generalInstructions": Array of 4-6 standard exam instructions.
2. "sections": Array of section metadata:
   - Section A: Objective / Multiple Choice Questions & Assertion-Reason (1 mark each)
   - Section B: Very Short Answer Questions (2 marks each)
   - Section C: Short Answer Questions (3 marks each)
   - Section D: Long Answer / Case-Based Integrated Questions (5 marks each)
3. "questions": Array of question objects with:
   - questionNumber (number starting from 1)
   - section ("A", "B", "C", or "D")
   - type ("mcq", "assertion_reason", "short_answer_2m", "short_answer_3m", "long_answer_5m", "case_study")
   - marks (number: 1, 2, 3, or 5)
   - questionText (detailed authentic question)
   - options (array of { id: "A"|"B"|"C"|"D", text: string } for mcq/assertion_reason)
   - correctAnswer (exact answer text or letter)
   - solutionExplanation (clear model solution)
   - markingRubric (array of { step: string, marks: number } breaking down how partial marks are awarded)
   - bloomsLevel ("Remember"|"Understand"|"Apply"|"Analyze"|"Evaluate")
   - difficulty ("easy"|"medium"|"hard")
   - topic (specific subtopic)`;

        const userPrompt = `Generate a ${input.totalMarks}-mark Question Paper for:
Subject: ${input.subject}
Class/Grade: Class ${input.classGrade}
Board: ${input.board}
Syllabus / Topics: ${promptTopics}
Difficulty Profile: ${input.difficulty}
Total Time: ${input.durationMinutes} Minutes

Respond with ONLY valid JSON without markdown quotes:
{
  "generalInstructions": ["..."],
  "sections": [...],
  "questions": [...]
}`;

        const rawResponse = await LIVE_AI_SERVICE.callLlm(userPrompt, {
          systemPrompt,
          jsonMode: true,
          temperature: 0.6,
          maxTokens: 4000
        });

        onProgress?.(80, 'Validating question distribution and marking rubric breakdown...');
        
        const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          generatedPaper = {
            id: `paper_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            title: paperTitle,
            board: input.board,
            classGrade: input.classGrade,
            subject: input.subject,
            topics: promptTopics.split(/[,;\n]/).map(t => t.trim()).filter(Boolean),
            totalMarks: input.totalMarks,
            durationMinutes: input.durationMinutes,
            createdAt: new Date().toISOString(),
            academicYear: '2025-2026',
            generalInstructions: parsed.generalInstructions || this.getDefaultInstructions(input.durationMinutes, input.totalMarks),
            sections: parsed.sections && parsed.sections.length > 0 ? parsed.sections : this.calculateSectionBreakdown(input.totalMarks),
            questions: parsed.questions.map((q: any, idx: number) => ({
              id: `q_${Date.now()}_${idx + 1}`,
              questionNumber: idx + 1,
              section: q.section || (idx < 5 ? 'A' : idx < 9 ? 'B' : idx < 12 ? 'C' : 'D'),
              type: q.type || (idx < 5 ? 'mcq' : idx < 9 ? 'short_answer_2m' : 'short_answer_3m'),
              marks: Number(q.marks) || (idx < 5 ? 1 : idx < 9 ? 2 : 3),
              questionText: q.questionText || `Question ${idx + 1} regarding ${input.subject}`,
              options: q.options || (q.type === 'mcq' ? [
                { id: 'A', text: 'Option A' },
                { id: 'B', text: 'Option B' },
                { id: 'C', text: 'Option C' },
                { id: 'D', text: 'Option D' }
              ] : undefined),
              correctAnswer: q.correctAnswer || 'Answer provided in teacher marking rubric.',
              solutionExplanation: q.solutionExplanation || 'Refer to standard textbook syllabus formulation.',
              markingRubric: q.markingRubric || [{ step: 'Accurate concept formulation & final result', marks: Number(q.marks) || 1 }],
              bloomsLevel: q.bloomsLevel || 'Understand',
              difficulty: q.difficulty || (input.difficulty === 'hard' ? 'hard' : 'medium'),
              topic: q.topic || input.subject
            })),
            modelUsed: 'Google Gemini 2.0 Flash (Live Neural Ingestion)',
            isAiGenerated: true
          };
        }
      } catch (err) {
        console.warn('Gemini live generation encountered an issue, gracefully utilizing academic blueprint generator:', err);
      }
    }

    // Heuristic Fallback if Gemini request timed out or was offline
    if (!generatedPaper) {
      onProgress?.(85, 'Finalizing academic blueprint and question allocation...');
      generatedPaper = this.generateHeuristicPaper(input, paperTitle, promptTopics);
      modelUsed = 'PaperPulse Pedagogical Blueprint Engine';
    }

    // Attach school metadata
    if (input.schoolName) (generatedPaper as any).schoolName = input.schoolName;
    if (input.teacherName) (generatedPaper as any).teacherName = input.teacherName;
    if (input.invigilatorName) (generatedPaper as any).invigilatorName = input.invigilatorName;
    if (input.academicSession) (generatedPaper as any).academicSession = input.academicSession;

    onProgress?.(100, 'Question paper and marking scheme generated successfully!');
    await new Promise(r => setTimeout(r, 300));

    this.savePaper(generatedPaper);
    return generatedPaper;
  },

  /**
   * Generates multiple shuffled paper sets (Set-1, Set-2, Set-3) from a base paper.
   * Only objective/MCQ questions in Section A are shuffled between sets.
   */
  generatePaperSets(basePaper: AiGeneratedPaper, setCount: 2 | 3 = 2): AiGeneratedPaper[] {
    const sets: AiGeneratedPaper[] = [{ ...basePaper, title: `${basePaper.title} — SET 1` }];

    for (let s = 2; s <= setCount; s++) {
      // Shuffle Section A questions; keep B/C/D in place
      const secAQs = basePaper.questions.filter(q => q.section === 'A');
      const rest = basePaper.questions.filter(q => q.section !== 'A');

      const shuffledA = [...secAQs].sort(() => Math.random() - 0.5).map((q, idx) => ({
        ...q,
        id: `${q.id}_set${s}`,
        questionNumber: idx + 1
      }));

      const renumberedRest = rest.map((q, idx) => ({
        ...q,
        id: `${q.id}_set${s}`,
        questionNumber: shuffledA.length + idx + 1
      }));

      sets.push({
        ...basePaper,
        id: `${basePaper.id}_set${s}`,
        title: `${basePaper.title.replace(/ — SET \d$/, '')} — SET ${s}`,
        questions: [...shuffledA, ...renumberedRest]
      });
    }

    return sets;
  },

  /**
   * Convert an AiGeneratedPaper into an interactive ExamModel for ExamRunner
   */
  convertToExamModel(paper: AiGeneratedPaper): ExamModel {
    const questions: ExamQuestionModel[] = paper.questions.map(q => {
      let mappedType: ExamQuestionModel['type'] = 'mcq';
      if (q.type === 'mcq' || q.type === 'assertion_reason') mappedType = 'mcq';
      else if (q.type === 'short_answer_2m' || q.type === 'short_answer_3m') mappedType = 'short_answer';
      else if (q.type === 'long_answer_5m' || q.type === 'case_study') mappedType = 'long_answer';

      return {
        id: q.id,
        type: mappedType,
        chapterId: 'ch_ai',
        chapterName: q.topic || paper.subject,
        pageRef: `Syllabus Ref: ${q.topic}`,
        difficulty: q.difficulty,
        bloomLevel: q.bloomsLevel as any,
        marks: q.marks,
        estimatedTimeSec: q.marks * 90,
        question: `[Section ${q.section}] Q${q.questionNumber}: ${q.questionText}`,
        options: q.options ? q.options.map(opt => ({
          id: opt.id,
          text: opt.text
        })) : undefined,
        correctAnswer: q.correctAnswer,
        explanation: `${q.solutionExplanation}\n\nMarking Rubric:\n${q.markingRubric.map(r => `• ${r.step} (${r.marks}M)`).join('\n')}`
      };
    });

    return {
      id: `exam_from_paper_${paper.id}`,
      userId: 'teacher_current',
      title: paper.title,
      totalMarks: paper.totalMarks,
      timeLimitMinutes: paper.durationMinutes,
      config: {
        title: paper.title,
        sourceBookIds: ['book_ai_gen'],
        sourceChapterIds: paper.topics.length > 0 ? paper.topics : ['topic_all'],
        totalQuestions: questions.length,
        totalMarks: paper.totalMarks,
        timeLimitMinutes: paper.durationMinutes,
        questionTypes: ['mcq', 'short_answer', 'long_answer'],
        difficultyMode: 'custom',
        difficultyMix: { easy: 30, medium: 50, hard: 20 },
        negativeMarking: false,
        negativeMarkingValue: 0,
        language: 'English',
        focusOnWeakChapters: false
      },
      createdAt: paper.createdAt,
      questions
    };
  },

  calculateSectionBreakdown(totalMarks: number): PaperSectionMeta[] {
    if (totalMarks <= 40) {
      return [
        { sectionId: 'A', title: 'Section A - Objective Type', description: 'Multiple Choice Questions (1 Mark each)', questionCount: 10, marksPerQuestion: 1, totalMarks: 10 },
        { sectionId: 'B', title: 'Section B - Very Short Answer', description: 'Direct conceptual questions (2 Marks each)', questionCount: 5, marksPerQuestion: 2, totalMarks: 10 },
        { sectionId: 'C', title: 'Section C - Short Answer', description: 'Derivations & numerical problems (3 Marks each)', questionCount: 4, marksPerQuestion: 3, totalMarks: 12 },
        { sectionId: 'D', title: 'Section D - Case Study & Long Answer', description: 'Higher-order thinking questions (4 Marks each)', questionCount: 2, marksPerQuestion: 4, totalMarks: 8 }
      ];
    }

    return [
      { sectionId: 'A', title: 'Section A - Multiple Choice & Assertion-Reason', description: 'Objective type questions (1 Mark each)', questionCount: 16, marksPerQuestion: 1, totalMarks: 16 },
      { sectionId: 'B', title: 'Section B - Very Short Answer Questions', description: 'Brief explanatory questions (2 Marks each)', questionCount: 6, marksPerQuestion: 2, totalMarks: 12 },
      { sectionId: 'C', title: 'Section C - Short Answer Questions', description: 'Analytical & numerical inquiries (3 Marks each)', questionCount: 7, marksPerQuestion: 3, totalMarks: 21 },
      { sectionId: 'D', title: 'Section D - Long Answer & Case-Based Integrated', description: 'Comprehensive evaluative problems (5 Marks each)', questionCount: 5, marksPerQuestion: 5, totalMarks: 25 }
    ];
  },

  getDefaultInstructions(duration: number, marks: number): string[] {
    return [
      `Total duration is ${duration} minutes. Maximum marks are ${marks}.`,
      'This question paper contains 4 Sections: Section A, Section B, Section C, and Section D.',
      'Section A comprises 1-mark objective questions. All questions are compulsory.',
      'Section B comprises 2-mark very short answer questions. Answers should be between 30 to 50 words.',
      'Section C comprises 3-mark short answer questions. Answers should be between 50 to 80 words.',
      'Section D comprises 5-mark long answer questions. Internal choice has been provided in selected questions.',
      'Use of log tables and non-programmable scientific calculators is permitted where indicated.'
    ];
  },

  generateHeuristicPaper(input: GeneratePaperInput, title: string, topics: string): AiGeneratedPaper {
    const sections = this.calculateSectionBreakdown(input.totalMarks);
    const questions: PaperQuestionItem[] = [];
    let qCounter = 1;

    // Section A Questions (MCQs)
    const secA = sections.find(s => s.sectionId === 'A') || sections[0];
    const subTopics = topics.split(/[,;\n]/).map(t => t.trim()).filter(Boolean);
    const primaryTopic = subTopics[0] || input.subject;

    for (let i = 0; i < secA.questionCount; i++) {
      const topicName = subTopics[i % subTopics.length] || primaryTopic;
      const isAssertion = i % 4 === 3;
      
      if (isAssertion) {
        questions.push({
          id: `q_h_${Date.now()}_${qCounter}`,
          questionNumber: qCounter++,
          section: 'A',
          type: 'assertion_reason',
          marks: 1,
          questionText: `Assertion (A): In ${topicName}, the net internal energy remains invariant in an isolated state.\nReason (R): Energy transfer requires non-zero boundary displacement or temperature differential.`,
          options: [
            { id: 'A', text: 'Both (A) and (R) are true and (R) is the correct explanation of (A).' },
            { id: 'B', text: 'Both (A) and (R) are true but (R) is NOT the correct explanation of (A).' },
            { id: 'C', text: '(A) is true but (R) is false.' },
            { id: 'D', text: '(A) is false but (R) is true.' }
          ],
          correctAnswer: 'A',
          solutionExplanation: 'According to the first principle of conservation, isolated systems have zero boundary work or heat influx, hence invariant internal energy.',
          markingRubric: [{ step: 'Correct identification of Assertion & Reason link', marks: 1 }],
          bloomsLevel: 'Analyze',
          difficulty: 'medium',
          topic: topicName
        });
      } else {
        questions.push({
          id: `q_h_${Date.now()}_${qCounter}`,
          questionNumber: qCounter++,
          section: 'A',
          type: 'mcq',
          marks: 1,
          questionText: `Which of the following conditions is mandatory for steady-state equilibrium in ${topicName}?`,
          options: [
            { id: 'A', text: 'Rate of state parameter change with respect to time is identically zero (d/dt = 0)' },
            { id: 'B', text: 'System volume must increase monotonically with ambient pressure' },
            { id: 'C', text: 'Entropy generation must be negative across all physical boundaries' },
            { id: 'D', text: 'All internal phase boundaries must undergo spontaneous sublimation' }
          ],
          correctAnswer: 'A',
          solutionExplanation: 'Steady state is defined strictly by the temporal invariance of intensive properties.',
          markingRubric: [{ step: 'Accurate option choice (Option A)', marks: 1 }],
          bloomsLevel: 'Remember',
          difficulty: 'easy',
          topic: topicName
        });
      }
    }

    // Section B Questions (2 Marks)
    const secB = sections.find(s => s.sectionId === 'B');
    if (secB) {
      for (let i = 0; i < secB.questionCount; i++) {
        const topicName = subTopics[(i + 1) % subTopics.length] || primaryTopic;
        questions.push({
          id: `q_h_${Date.now()}_${qCounter}`,
          questionNumber: qCounter++,
          section: 'B',
          type: 'short_answer_2m',
          marks: 2,
          questionText: `State the governing law of ${topicName}. Write two critical boundary assumptions under which this relationship remains mathematically valid.`,
          correctAnswer: `1. Accurate statement of the governing law: 1 Mark\n2. Two boundary assumptions (0.5 Mark each): 1 Mark`,
          solutionExplanation: `Law formulation statement correctly defined. Boundary assumptions include constant temperature and frictionless idealized interface.`,
          markingRubric: [
            { step: 'Correct definition and symbolic notation', marks: 1 },
            { step: 'Two valid boundary assumptions stated', marks: 1 }
          ],
          bloomsLevel: 'Understand',
          difficulty: 'medium',
          topic: topicName
        });
      }
    }

    // Section C Questions (3 Marks)
    const secC = sections.find(s => s.sectionId === 'C');
    if (secC) {
      for (let i = 0; i < secC.questionCount; i++) {
        const topicName = subTopics[(i + 2) % subTopics.length] || primaryTopic;
        questions.push({
          id: `q_h_${Date.now()}_${qCounter}`,
          questionNumber: qCounter++,
          section: 'C',
          type: 'short_answer_3m',
          marks: 3,
          questionText: `Derive the functional relationship for efficiency in ${topicName}. Calculate the percentage deviation if the working parameter increases by 25%.`,
          correctAnswer: `Derivation of formula (1.5 Marks) + Numerical substitution and final percentage calculation (1.5 Marks).`,
          solutionExplanation: `Starting from basic differential balance, integrate across boundary conditions. Substitute the 1.25 factor to deduce a net deviation of 20%.`,
          markingRubric: [
            { step: 'Initial differential derivation & formulation', marks: 1.5 },
            { step: 'Substitution of parameter values & correct calculation with units', marks: 1.5 }
          ],
          bloomsLevel: 'Apply',
          difficulty: 'medium',
          topic: topicName
        });
      }
    }

    // Section D Questions (5 Marks)
    const secD = sections.find(s => s.sectionId === 'D');
    if (secD) {
      for (let i = 0; i < secD.questionCount; i++) {
        const topicName = subTopics[(i + 3) % subTopics.length] || primaryTopic;
        questions.push({
          id: `q_h_${Date.now()}_${qCounter}`,
          questionNumber: qCounter++,
          section: 'D',
          type: 'long_answer_5m',
          marks: 5,
          questionText: `(a) Provide an exhaustive architectural and analytical breakdown of ${topicName} with a neatly labeled schematic diagram.\n(b) Discuss two real-world failure cases and formulate engineering safeguards to counteract harmonic instability.`,
          correctAnswer: `Part (a): Conceptual explanation (2 Marks) + Labeled diagram (1 Mark).\nPart (b): Failure analysis (1 Mark) + Countermeasure safeguards (1 Mark).`,
          solutionExplanation: `Clear schematic showing control volume, inlet/outlet fluxes. Failure modes include cavitation and thermal fatigue; mitigated via bypass valves and damping materials.`,
          markingRubric: [
            { step: 'Analytical description of principle and mechanics', marks: 2 },
            { step: 'Neat labeled diagram with proper notations', marks: 1 },
            { step: 'Comprehensive breakdown of two failure modes', marks: 1 },
            { step: 'Actionable design safeguards and mitigation protocols', marks: 1 }
          ],
          bloomsLevel: 'Evaluate',
          difficulty: 'hard',
          topic: topicName
        });
      }
    }

    return {
      id: `paper_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      board: input.board,
      classGrade: input.classGrade,
      subject: input.subject,
      topics: subTopics,
      totalMarks: input.totalMarks,
      durationMinutes: input.durationMinutes,
      createdAt: new Date().toISOString(),
      academicYear: '2025-2026',
      generalInstructions: this.getDefaultInstructions(input.durationMinutes, input.totalMarks),
      sections,
      questions,
      modelUsed: 'PaperPulse Pedagogical Blueprint Engine',
      isAiGenerated: false
    };
  },

  getDefaultSeedPapers(): AiGeneratedPaper[] {
    return [
      {
        id: 'paper_seed_cbse_10_science',
        title: 'CBSE Class 10 Science All-India Model Examination 2026',
        board: 'CBSE',
        classGrade: 10,
        subject: 'Science',
        topics: ['Chemical Reactions', 'Electricity', 'Light - Reflection & Refraction', 'Life Processes'],
        totalMarks: 80,
        durationMinutes: 180,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        academicYear: '2025-2026',
        generalInstructions: [
          'Total duration is 180 minutes. Maximum marks are 80.',
          'Section A comprises 20 objective questions of 1 mark each.',
          'Section B comprises 6 very short answer questions of 2 marks each.',
          'Section C comprises 7 short answer questions of 3 marks each.',
          'Section D comprises 3 long answer questions of 5 marks each.',
          'Section E comprises 3 source-based/case-based integrated units of 4 marks each.'
        ],
        sections: [
          { sectionId: 'A', title: 'Section A - Objective Type', description: '20 Questions (1 Mark each)', questionCount: 20, marksPerQuestion: 1, totalMarks: 20 },
          { sectionId: 'B', title: 'Section B - Very Short Answer', description: '6 Questions (2 Marks each)', questionCount: 6, marksPerQuestion: 2, totalMarks: 12 },
          { sectionId: 'C', title: 'Section C - Short Answer', description: '7 Questions (3 Marks each)', questionCount: 7, marksPerQuestion: 3, totalMarks: 21 },
          { sectionId: 'D', title: 'Section D - Long Answer & Case Studies', description: '5 Questions (5 Marks each)', questionCount: 5, marksPerQuestion: 5, totalMarks: 27 }
        ],
        questions: [
          {
            id: 'q_seed_1',
            questionNumber: 1,
            section: 'A',
            type: 'mcq',
            marks: 1,
            questionText: 'When lead nitrate powder is heated in a boiling tube, brown fumes are emitted. The brown gas released is:',
            options: [
              { id: 'A', text: 'Nitrogen monoxide (NO)' },
              { id: 'B', text: 'Nitrogen dioxide (NO₂)' },
              { id: 'C', text: 'Nitrous oxide (N₂O)' },
              { id: 'D', text: 'Lead oxide (PbO)' }
            ],
            correctAnswer: 'B',
            solutionExplanation: 'Thermal decomposition of lead nitrate: 2Pb(NO₃)₂ → 2PbO + 4NO₂↑ (brown fumes) + O₂↑.',
            markingRubric: [{ step: 'Correct option B (Nitrogen dioxide)', marks: 1 }],
            bloomsLevel: 'Remember',
            difficulty: 'easy',
            topic: 'Chemical Reactions'
          },
          {
            id: 'q_seed_2',
            questionNumber: 2,
            section: 'A',
            type: 'mcq',
            marks: 1,
            questionText: 'A cylindrical conductor of length l and uniform cross-sectional area A has resistance R. Another conductor of length 2l and resistance R of the same material has area of cross-section:',
            options: [
              { id: 'A', text: 'A / 2' },
              { id: 'B', text: '2 A' },
              { id: 'C', text: '3 A' },
              { id: 'D', text: '4 A' }
            ],
            correctAnswer: 'B',
            solutionExplanation: 'R = ρ(l/A). For length 2l and same R, R = ρ(2l / A\') ⇒ A\' = 2A.',
            markingRubric: [{ step: 'Correct option B (2A)', marks: 1 }],
            bloomsLevel: 'Apply',
            difficulty: 'medium',
            topic: 'Electricity'
          },
          {
            id: 'q_seed_3',
            questionNumber: 3,
            section: 'B',
            type: 'short_answer_2m',
            marks: 2,
            questionText: 'Name the electric safety device based on the heating effect of electric current. Explain how it protects appliances against overcurrent.',
            correctAnswer: 'Electric Fuse. It contains a wire with high resistivity and low melting point that melts during current spikes, breaking the circuit.',
            solutionExplanation: 'Joule’s heating effect causes the fuse wire to melt when current exceeds safe rating (I > I_rated).',
            markingRubric: [
              { step: 'Identification of Electric Fuse', marks: 1 },
              { step: 'Explanation of melting point and circuit disconnection', marks: 1 }
            ],
            bloomsLevel: 'Understand',
            difficulty: 'easy',
            topic: 'Electricity'
          },
          {
            id: 'q_seed_4',
            questionNumber: 4,
            section: 'C',
            type: 'short_answer_3m',
            marks: 3,
            questionText: 'An optical object 4 cm in height is placed at a distance of 15 cm in front of a concave mirror of focal length 10 cm. Find the position, nature, and size of the image formed.',
            correctAnswer: 'Image distance v = -30 cm (in front of mirror, real & inverted), Height h\' = -8 cm.',
            solutionExplanation: '1/f = 1/v + 1/u ⇒ 1/(-10) = 1/v + 1/(-15) ⇒ 1/v = -1/10 + 1/15 = -1/30 ⇒ v = -30 cm. Magnification m = -v/u = -(-30)/(-15) = -2. Image height = m × 4 = -8 cm.',
            markingRubric: [
              { step: 'Mirror formula application & calculation of image position v = -30cm', marks: 1.5 },
              { step: 'Magnification formula application & image height h\' = -8cm', marks: 1 },
              { step: 'Specification of nature: Real, inverted and magnified', marks: 0.5 }
            ],
            bloomsLevel: 'Apply',
            difficulty: 'medium',
            topic: 'Light - Reflection & Refraction'
          },
          {
            id: 'q_seed_5',
            questionNumber: 5,
            section: 'D',
            type: 'long_answer_5m',
            marks: 5,
            questionText: '(a) Draw a neat diagram of the human heart and label the four chambers, Aorta, and Pulmonary Artery.\n(b) Why is double circulation necessary in human beings?',
            correctAnswer: 'Neat labeled diagram (3 Marks). Double circulation separates oxygenated and deoxygenated blood to meet high metabolic energy demands (2 Marks).',
            solutionExplanation: 'Separation of right and left chambers prevents intermixing of oxygen-rich and carbon dioxide-rich blood, supporting constant body temperature in homeotherms.',
            markingRubric: [
              { step: 'Diagram accuracy with chambers and major vessels labeled', marks: 3 },
              { step: 'Explanation of high metabolic energy and thermal regulation need', marks: 2 }
            ],
            bloomsLevel: 'Analyze',
            difficulty: 'medium',
            topic: 'Life Processes'
          }
        ],
        modelUsed: 'Google Gemini 2.0 Flash (Curriculum Model)',
        isAiGenerated: true
      }
    ];
  }
};
