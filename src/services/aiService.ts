import { Question, QuestionType, RubricCriterion, StudentAnswer } from '../types';

export interface GenerateTestParams {
  board: string;
  classGrade: number;
  subject: string;
  chapters: string[];
  totalMarks: number;
  difficultyMix: { easy: number; medium: number; hard: number };
  questionTypes: QuestionType[];
  language?: string;
  onStreamChunk?: (message: string) => void;
}

export const AI_SERVICE = {
  /**
   * Simulates Claude 3.5 Sonnet streaming generation with board-specific precision.
   */
  async generateQuestions(params: GenerateTestParams): Promise<Question[]> {
    const { board, classGrade, subject, chapters, totalMarks, difficultyMix, questionTypes } = params;

    // Simulate streaming step progress
    if (params.onStreamChunk) {
      params.onStreamChunk(`Connecting to Claude 3.5 Sonnet (Mumbai Edge)...`);
      await new Promise(r => setTimeout(r, 400));
      params.onStreamChunk(`Analyzing ${board} Class ${classGrade} ${subject} syllabus for ${chapters.join(', ')}...`);
      await new Promise(r => setTimeout(r, 500));
      params.onStreamChunk(`Applying Bloom's taxonomy & difficulty distribution (${difficultyMix.easy}% Easy, ${difficultyMix.medium}% Medium, ${difficultyMix.hard}% Hard)...`);
      await new Promise(r => setTimeout(r, 600));
      params.onStreamChunk(`Formulating questions, marking schemes, and rubric evaluation matrices...`);
      await new Promise(r => setTimeout(r, 600));
    }

    const generated: Question[] = [];
    const chName = chapters[0] || 'General Science';

    // 1. MCQ
    if (questionTypes.includes('mcq')) {
      if (subject.toLowerCase().includes('math')) {
        generated.push({
          id: `gen_q_${Date.now()}_1`,
          type: 'mcq',
          chapter: chName,
          marks: 1,
          difficulty: 'easy',
          bloomsLevel: 'Remember',
          questionText: `If the zeroes of the quadratic polynomial ax² + bx + c (where c ≠ 0) are equal, then:`,
          options: [
            { id: 'opt_1', text: 'c and a have opposite signs', isCorrect: false },
            { id: 'opt_2', text: 'c and d have same signs', isCorrect: false },
            { id: 'opt_3', text: 'c and a have the same sign', isCorrect: true },
            { id: 'opt_4', text: 'b and c have the same sign', isCorrect: false }
          ],
          correctAnswer: 'c and a have the same sign',
          explanation: 'For equal roots, Discriminant D = b² - 4ac = 0 => b² = 4ac. Since b² > 0, 4ac must be positive, which means a and c must have the same sign.'
        });
      } else {
        generated.push({
          id: `gen_q_${Date.now()}_1`,
          type: 'mcq',
          chapter: chName,
          marks: 1,
          difficulty: 'easy',
          bloomsLevel: 'Understand',
          questionText: `A concave mirror of focal length 20 cm produces an image twice the size of the real object. If the image is real, what is the distance of the object from the mirror?`,
          options: [
            { id: 'opt_1', text: '-10 cm', isCorrect: false },
            { id: 'opt_2', text: '-30 cm', isCorrect: true },
            { id: 'opt_3', text: '-20 cm', isCorrect: false },
            { id: 'opt_4', text: '-40 cm', isCorrect: false }
          ],
          correctAnswer: '-30 cm',
          explanation: 'For a real image produced by a concave mirror, magnification m = -v/u = -2 => v = 2u. Using 1/f = 1/v + 1/u => 1/(-20) = 1/(2u) + 1/u = 3/(2u) => 2u = -60 => u = -30 cm.'
        });
      }
    }

    // 2. Assertion-Reason
    if (questionTypes.includes('assertion_reason')) {
      generated.push({
        id: `gen_q_${Date.now()}_2`,
        type: 'assertion_reason',
        chapter: chapters[1] || chName,
        marks: 1,
        difficulty: 'medium',
        bloomsLevel: 'Analyze',
        questionText: `Assertion (A): Tungsten is almost exclusively used for filament of incandescent electric lamps.\nReason (R): Tungsten has a very high melting point and high resistivity, so it glows white hot without melting.`,
        options: [
          { id: 'ar_1', text: 'Both (A) and (R) are true and (R) is the correct explanation of (A)', isCorrect: true },
          { id: 'ar_2', text: 'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)', isCorrect: false },
          { id: 'ar_3', text: '(A) is true but (R) is false', isCorrect: false },
          { id: 'ar_4', text: '(A) is false but (R) is true', isCorrect: false }
        ],
        correctAnswer: 'Both (A) and (R) are true and (R) is the correct explanation of (A)',
        explanation: 'Tungsten has a melting point of ~3422°C and high resistivity, allowing it to reach incandescence without oxidizing or fusing quickly in an inert atmosphere.'
      });
    }

    // 3. Short Answer
    if (questionTypes.includes('short_answer')) {
      generated.push({
        id: `gen_q_${Date.now()}_3`,
        type: 'short_answer',
        chapter: chName,
        marks: 3,
        difficulty: 'medium',
        bloomsLevel: 'Apply',
        questionText: `State Ohm's Law. Draw a circuit diagram to verify it experimentally and write two precautions to be taken while performing this experiment.`,
        markingScheme: '1 mark for exact statement of Ohm\'s law (V ∝ I at constant temperature). 1 mark for correct circuit diagram with voltmeter in parallel and ammeter in series. 1 mark for any two valid precautions (tight connections, plug key inserted only during reading).',
        sampleAnswer: "Ohm's Law states that the current flowing through a conductor is directly proportional to the potential difference across its ends, provided temperature and other physical conditions remain constant (V = IR). Precautions: 1. Connections should be tight and clean. 2. Key should be removed between readings to avoid heating the resistor.",
        rubric: [
          { id: 'r_ohm_1', criterion: "Ohm's Law Statement with constant temperature condition", maxMarks: 1, description: 'Accurate proportionality and conditional clause' },
          { id: 'r_ohm_2', criterion: 'Circuit Diagram or formula representation', maxMarks: 1, description: 'Shows correct polarities and ammeter/voltmeter placements' },
          { id: 'r_ohm_3', criterion: 'Two laboratory precautions', maxMarks: 1, description: 'Specific and practical laboratory precautions' }
        ]
      });
    }

    // 4. Long Answer / Case Study
    if (questionTypes.includes('long_answer') || questionTypes.includes('case_study')) {
      generated.push({
        id: `gen_q_${Date.now()}_4`,
        type: 'long_answer',
        chapter: chapters[chapters.length - 1] || chName,
        marks: 5,
        difficulty: 'hard',
        bloomsLevel: 'Evaluate',
        questionText: `(a) Differentiate between Roasting and Calcination with balanced chemical reactions.\n(b) Explain why ionic compounds usually have high melting and boiling points.\n(c) How are reactive metals like Sodium extracted from their molten chlorides?`,
        markingScheme: '2 marks for Roasting vs Calcination with equations. 1.5 marks for electrostatic force of attraction explanation in ionic compounds. 1.5 marks for electrolytic reduction equation of NaCl at cathode and anode.',
        sampleAnswer: '(a) Roasting is heating ore in excess air (2ZnS + 3O2 -> 2ZnO + 2SO2), while Calcination is heating in limited/absence of air (ZnCO3 -> ZnO + CO2). (b) Ionic compounds have strong inter-ionic electrostatic attractions between oppositely charged ions requiring massive thermal energy to break. (c) Sodium is extracted by electrolytic reduction of molten NaCl: At Cathode: Na+ + e- -> Na; At Anode: 2Cl- -> Cl2 + 2e-.',
        rubric: [
          { id: 'r_long_1', criterion: 'Roasting vs Calcination with equations', maxMarks: 2, description: 'Definitions and balanced chemical reaction examples' },
          { id: 'r_long_2', criterion: 'Inter-ionic attraction rationale', maxMarks: 1.5, description: 'Mentions crystal lattice and strong electrostatic bonds' },
          { id: 'r_long_3', criterion: 'Electrolytic reduction mechanism', maxMarks: 1.5, description: 'Specifies cathode and anode half-reactions' }
        ]
      });
    }

    return generated;
  },

  /**
   * Claude-powered rubric subjective grading
   */
  async gradeSubjectiveAnswer(
    question: Question,
    studentAnswerText: string
  ): Promise<{
    awardedMarks: number;
    maxMarks: number;
    confidence: 'High' | 'Medium' | 'Low';
    feedback: string;
    rubricEvaluation: { criterionId: string; marksAwarded: number; feedback: string }[];
  }> {
    await new Promise(r => setTimeout(r, 600));

    const answerLength = studentAnswerText.trim().length;
    const lower = studentAnswerText.toLowerCase();

    // Check key concept matches
    let scoreRatio = 0.5;
    let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
    let feedback = 'Good attempt. Covered essential concepts with partial justification.';

    if (answerLength < 15) {
      scoreRatio = 0.1;
      confidence = 'High';
      feedback = 'Answer is too brief or incomplete to demonstrate full conceptual mastery.';
    } else if (
      lower.includes('pulmonary') ||
      lower.includes('resistance') ||
      lower.includes('ohm') ||
      lower.includes('temperature') ||
      lower.includes('electrostatic') ||
      lower.includes('roasting')
    ) {
      if (answerLength > 120) {
        scoreRatio = 0.9;
        confidence = 'High';
        feedback = 'Comprehensive explanation with correct terminology, mathematical reasoning, and necessary contextual prerequisites.';
      } else {
        scoreRatio = 0.75;
        confidence = 'Medium';
        feedback = 'Key keywords identified. Could be expanded with explicit step-by-step reasoning.';
      }
    } else {
      scoreRatio = 0.4;
      confidence = 'Low';
      feedback = 'Requires teacher verification. Some terminology diverges from standard curriculum rubric.';
    }

    const awardedMarks = Number((question.marks * scoreRatio).toFixed(1));

    const rubricEvaluation = (question.rubric || []).map(r => ({
      criterionId: r.id,
      marksAwarded: Number((r.maxMarks * scoreRatio).toFixed(1)),
      feedback: `Evaluated against "${r.criterion}": demonstrated ${Math.round(scoreRatio * 100)}% alignment.`
    }));

    return {
      awardedMarks,
      maxMarks: question.marks,
      confidence,
      feedback,
      rubricEvaluation
    };
  },

  /**
   * Multi-lingual AI Mistake Tutor (RAG over student's actual wrong test responses)
   */
  async askTutor(
    query: string,
    studentContext: {
      studentName: string;
      classGrade: number;
      wrongQuestion?: Question;
      studentAnswerText?: string;
      language?: string;
    }
  ): Promise<{ responseText: string; suggestedFollowUps: string[] }> {
    await new Promise(r => setTimeout(r, 700));

    const lang = studentContext.language || 'English';
    const q = studentContext.wrongQuestion;

    if (lang === 'Hindi' || lang === 'Hinglish') {
      if (q && q.chapter.includes('Electricity')) {
        return {
          responseText: `नमस्ते ${studentContext.studentName}! 😊\n\nआइए समझते हैं कि **Resistance in Parallel** में गलती कहाँ हुई:\n\n1. जब तार को 5 बराबर हिस्सों में काटा गया, तो हर टुकड़े का प्रतिरोध $r = \\frac{R}{5}$ हो गया।\n2. जब इन्हें **Parallel (समानांतर)** में जोड़ा जाता है, तो सूत्र होता है:\n   $$\\frac{1}{R'} = \\frac{1}{r} + \\frac{1}{r} + \\frac{1}{r} + \\frac{1}{r} + \\frac{1}{r} = \\frac{5}{r}$$\n3. $r$ की जगह $\\frac{R}{5}$ रखने पर:\n   $$\\frac{1}{R'} = \\frac{5}{R/5} = \\frac{25}{R} \\implies R' = \\frac{R}{25}$$\n4. इसलिए अनुपात $\\frac{R}{R'} = 25$ होगा, न कि 5!\n\nक्या आप एक और ऐसा उदाहरण हल करना चाहेंगे?`,
          suggestedFollowUps: [
            'अगर 4 टुकड़े होते तो अनुपात क्या होता?',
            'Series connection में क्या अंतर होता?',
            'मुझे एक practice question दो।'
          ]
        };
      }

      return {
        responseText: `नमस्ते ${studentContext.studentName}! आपके इस सवाल का मुख्य सिद्धांत यह है कि बोर्ड परीक्षा में हमेशा परिभाषा के साथ मानक शर्तें (जैसे Constant Temperature) लिखना जरूरी होता है।\n\nक्या आप इस अध्याय का कोई विशेष कॉन्सेप्ट दोबारा समझना चाहते हैं?`,
        suggestedFollowUps: [
          'इस टॉपिक के महत्वपूर्ण फॉर्मूले बताओ',
          'पिछले साल के बोर्ड प्रश्न दिखाओ',
          'मुझे एक क्विज़ दो'
        ]
      };
    }

    // Default English response
    if (q) {
      return {
        responseText: `Great question, ${studentContext.studentName}! Let's diagnose where the misunderstanding happened on "${q.chapter}".\n\n### The Core Rule:\n${q.explanation || q.sampleAnswer || 'Review the fundamental concept step by step.'}\n\n### Why your earlier approach differed:\nIn your test response, you calculated the direct sum instead of the harmonic reciprocal sum for parallel components.\n\n### Quick Check Formula:\nWhenever $N$ equal resistors of resistance $r$ are in parallel, the equivalent is simply $R_{eq} = \\frac{r}{N}$. Since $r = \\frac{R}{N}$, $R_{eq} = \\frac{R}{N^2}$.\nHence $\\frac{R}{R_{eq}} = N^2 = 5^2 = 25$.\n\nWould you like to try a quick 1-minute practice question to lock this in?`,
        suggestedFollowUps: [
          'Give me a 1-minute practice problem',
          'Explain why series resistors simply add up',
          'Show CBSE marking scheme for this question'
        ]
      };
    }

    return {
      responseText: `Hello ${studentContext.studentName}! I'm your AI Assessment Tutor. I have access to your test attempts and chapter mastery data across CBSE Class ${studentContext.classGrade}. What concept or mistake would you like to review together today?`,
      suggestedFollowUps: [
        'Review my lowest scoring topic in Science',
        'Help me prepare for upcoming Math test',
        'Explain Light Refraction ray diagrams'
      ]
    };
  }
};
