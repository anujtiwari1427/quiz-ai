import assert from 'node:assert/strict';

console.log('--- STARTING FEATURE 2 AUTOMATED TEST SUITE ---');

// 1. JSON Extraction and Repair
function extractAndRepairJson(rawText) {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIdx = 0;
  let isObject = true;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    isObject = true;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    isObject = false;
  }

  const endChar = isObject ? '}' : ']';
  const lastIdx = cleaned.lastIndexOf(endChar);

  if (startIdx !== -1 && lastIdx !== -1 && lastIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, lastIdx + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    let repaired = cleaned.replace(/,\s*([}\]])/g, '$1');
    try {
      return JSON.parse(repaired);
    } catch (err2) {
      repaired = repaired.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      return JSON.parse(repaired);
    }
  }
}

// 2. MCQ Validation and Fix
function validateAndFixMcqQuestion(q) {
  if (q.type !== 'mcq') return q;
  let options = q.options || [];

  if (options.length === 0) {
    options = [
      { id: 'A', text: q.correctAnswer || 'Option A' },
      { id: 'B', text: 'Option B' },
      { id: 'C', text: 'Option C' },
      { id: 'D', text: 'Option D' }
    ];
  }

  const standardIds = ['A', 'B', 'C', 'D'];
  const fixedOptions = options.slice(0, 4).map((opt, i) => ({
    id: standardIds[i] || String.fromCharCode(65 + i),
    text: opt.text ? String(opt.text).trim() : `Option ${standardIds[i]}`
  }));

  while (fixedOptions.length < 4) {
    const nextId = standardIds[fixedOptions.length];
    fixedOptions.push({
      id: nextId,
      text: `Distractor ${nextId}`
    });
  }

  const matchOption = fixedOptions.find(o => 
    o.id.toUpperCase() === q.correctAnswer.toUpperCase() ||
    o.text.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
  );

  const correctAnswer = matchOption ? matchOption.id : 'A';

  return {
    ...q,
    options: fixedOptions,
    correctAnswer
  };
}

// 3. Section Builder
function buildSections(questions, marksPerType) {
  const sections = [];

  const mcqs = questions.filter(q => q.type === 'mcq');
  if (mcqs.length > 0) {
    sections.push({
      id: 'sec-a',
      name: 'Section A: Multiple Choice Questions',
      questionType: 'mcq',
      instructions: 'All questions are compulsory. Select the one correct option (A, B, C, or D). Each question carries 1 mark.',
      marksPerQuestion: marksPerType.mcq || 1,
      totalMarks: mcqs.reduce((s, q) => s + q.marks, 0),
      questions: mcqs
    });
  }

  const objectives = questions.filter(q => q.type === 'true_false' || q.type === 'fill_in_blank');
  if (objectives.length > 0) {
    sections.push({
      id: 'sec-b',
      name: 'Section B: Objective Questions',
      questionType: 'fill_in_blank',
      instructions: 'Answer all objective questions. Write clear and unambiguous answers.',
      marksPerQuestion: 1,
      totalMarks: objectives.reduce((s, q) => s + q.marks, 0),
      questions: objectives
    });
  }

  const shortAnswers = questions.filter(q => q.type === 'short_answer');
  if (shortAnswers.length > 0) {
    sections.push({
      id: 'sec-c',
      name: 'Section C: Short Answer Questions',
      questionType: 'short_answer',
      instructions: 'Answer in 2 to 3 concise steps. Show intermediate working where appropriate.',
      marksPerQuestion: marksPerType.short_answer || 2,
      totalMarks: shortAnswers.reduce((s, q) => s + q.marks, 0),
      questions: shortAnswers
    });
  }

  const longAnswers = questions.filter(q => q.type === 'long_answer' || q.type === 'numerical');
  if (longAnswers.length > 0) {
    sections.push({
      id: 'sec-d',
      name: 'Section D: Long Answer & Numerical Problems',
      questionType: 'long_answer',
      instructions: 'Show complete calculations, diagrams (if required), and formal statements.',
      marksPerQuestion: marksPerType.long_answer || 4,
      totalMarks: longAnswers.reduce((s, q) => s + q.marks, 0),
      questions: longAnswers
    });
  }

  return sections;
}

// 4. Delete Question from Paper
function deleteQuestion(paper, questionId) {
  const updatedQuestions = paper.questions.filter(q => q.id !== questionId);
  const updatedSections = paper.sections
    .map(sec => {
      const filtered = sec.questions.filter(q => q.id !== questionId);
      return {
        ...sec,
        questions: filtered,
        totalMarks: filtered.reduce((acc, q) => acc + q.marks, 0)
      };
    })
    .filter(sec => sec.questions.length > 0);

  return {
    ...paper,
    questions: updatedQuestions,
    sections: updatedSections,
    totalMarks: updatedSections.reduce((acc, s) => acc + s.totalMarks, 0)
  };
}

// 5. Reorder Question inside Section
function reorderQuestion(paper, sectionId, fromIndex, toIndex) {
  const section = paper.sections.find(s => s.id === sectionId);
  if (!section) return paper;

  const list = [...section.questions];
  if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
    return paper;
  }

  const [moved] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, moved);

  const updatedSections = paper.sections.map(s => s.id === sectionId ? { ...s, questions: list } : s);
  const flat = [];
  updatedSections.forEach(s => flat.push(...s.questions));

  return {
    ...paper,
    sections: updatedSections,
    questions: flat
  };
}

// 6. Convert to ExamModel
function convertToExamModel(paper) {
  return {
    id: paper.id,
    userId: paper.userId,
    title: paper.title,
    config: {
      title: paper.title,
      sourceBookIds: paper.bookId ? [paper.bookId] : [],
      sourceChapterIds: [],
      exerciseMode: paper.exerciseMode,
      totalQuestions: paper.questions.length,
      totalMarks: paper.totalMarks,
      questionTypes: Array.from(new Set(paper.questions.map(q => q.type))),
      difficultyMode: 'custom',
      difficultyMix: { easy: 30, medium: 50, hard: 20 },
      timeLimitMinutes: paper.durationMinutes || 60,
      negativeMarking: false,
      negativeMarkingValue: 0,
      language: 'English',
      focusOnWeakChapters: false
    },
    questions: paper.questions,
    totalMarks: paper.totalMarks,
    timeLimitMinutes: paper.durationMinutes || 60,
    createdAt: paper.createdAt
  };
}

let passedTests = 0;
function test(desc, fn) {
  try {
    fn();
    console.log(`  ✓ ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// RUN TESTS
test('JSON Repair: Handles markdown ```json fences and clean object', () => {
  const raw = '```json\n[{"id":"q-1","question":"What is a set?","type":"mcq","marks":1}]\n```';
  const parsed = extractAndRepairJson(raw);
  assert(Array.isArray(parsed));
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].question, 'What is a set?');
});

test('JSON Repair: Repairs trailing commas before closing braces/brackets', () => {
  const raw = `[
    {
      "id": "q-1",
      "question": "Which set is empty?",
      "type": "mcq",
      "marks": 1,
    },
  ]`;
  const parsed = extractAndRepairJson(raw);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].id, 'q-1');
});

test('MCQ Validator: Fixes incomplete options and sets exactly 4 standard options (A, B, C, D)', () => {
  const malformed = {
    id: 'q-mcq-test',
    type: 'mcq',
    chapterId: 'ch-1',
    chapterName: 'Sets',
    pageRef: 'Page 5',
    difficulty: 'medium',
    bloomLevel: 'Understand',
    marks: 1,
    question: 'Which of the following is a singleton set?',
    options: [
      { id: '1', text: 'Set of even prime numbers' },
      { id: '2', text: 'Empty set' }
    ],
    correctAnswer: 'Set of even prime numbers',
    explanation: '2 is the only even prime number',
    estimatedTimeSec: 60
  };

  const fixed = validateAndFixMcqQuestion(malformed);
  assert.equal(fixed.options.length, 4);
  assert.equal(fixed.options[0].id, 'A');
  assert.equal(fixed.options[1].id, 'B');
  assert.equal(fixed.options[2].id, 'C');
  assert.equal(fixed.options[3].id, 'D');
  assert.equal(fixed.correctAnswer, 'A');
});

test('Sections Builder: Automatically builds 4 official examination sections and balances marks', () => {
  const sampleQuestions = [
    { id: 'q-1', type: 'mcq', marks: 1, question: 'MCQ 1' },
    { id: 'q-2', type: 'true_false', marks: 1, question: 'True/False 1' },
    { id: 'q-3', type: 'short_answer', marks: 2, question: 'Short answer 1' },
    { id: 'q-4', type: 'long_answer', marks: 4, question: 'Long answer 1' }
  ];

  const sections = buildSections(sampleQuestions, {
    mcq: 1, true_false: 1, fill_in_blank: 1, short_answer: 2, long_answer: 4, numerical: 3
  });

  assert.equal(sections.length, 4);
  assert.equal(sections[0].id, 'sec-a');
  assert.equal(sections[0].totalMarks, 1);
  assert.equal(sections[1].id, 'sec-b');
  assert.equal(sections[1].totalMarks, 1);
  assert.equal(sections[2].id, 'sec-c');
  assert.equal(sections[2].totalMarks, 2);
  assert.equal(sections[3].id, 'sec-d');
  assert.equal(sections[3].totalMarks, 4);

  const total = sections.reduce((s, sec) => s + sec.totalMarks, 0);
  assert.equal(total, 8);
});

test('Question Deletion: Removes question from paper and automatically recalculates section marks and paper total', () => {
  const dummyPaper = {
    id: 'paper-test-1',
    userId: 'test-user',
    title: 'Unit Test Paper',
    subject: 'Mathematics',
    durationMinutes: 60,
    totalMarks: 5,
    exerciseMode: 'mixed',
    sections: [
      {
        id: 'sec-a',
        name: 'Section A',
        questionType: 'mcq',
        instructions: 'Answer all',
        marksPerQuestion: 1,
        totalMarks: 2,
        questions: [
          { id: 'q-del-1', type: 'mcq', marks: 1, question: 'Q1' },
          { id: 'q-keep-2', type: 'mcq', marks: 1, question: 'Q2' }
        ]
      },
      {
        id: 'sec-c',
        name: 'Section C',
        questionType: 'short_answer',
        instructions: 'Answer in 2 steps',
        marksPerQuestion: 3,
        totalMarks: 3,
        questions: [
          { id: 'q-keep-3', type: 'short_answer', marks: 3, question: 'Q3' }
        ]
      }
    ],
    questions: [],
    createdAt: new Date().toISOString()
  };

  dummyPaper.questions = [...dummyPaper.sections[0].questions, ...dummyPaper.sections[1].questions];

  const updated = deleteQuestion(dummyPaper, 'q-del-1');
  assert.equal(updated.questions.length, 2);
  assert.equal(updated.sections[0].questions.length, 1);
  assert.equal(updated.sections[0].totalMarks, 1);
  assert.equal(updated.totalMarks, 4);
});

test('Question Reorder: Moves question from index 0 to index 1 inside a section', () => {
  const dummyPaper = {
    id: 'paper-test-2',
    userId: 'test-user',
    title: 'Unit Test Paper',
    subject: 'Mathematics',
    durationMinutes: 60,
    totalMarks: 2,
    exerciseMode: 'mixed',
    sections: [
      {
        id: 'sec-a',
        name: 'Section A',
        questionType: 'mcq',
        instructions: 'Answer all',
        marksPerQuestion: 1,
        totalMarks: 2,
        questions: [
          { id: 'first-q', type: 'mcq', marks: 1, question: 'First' },
          { id: 'second-q', type: 'mcq', marks: 1, question: 'Second' }
        ]
      }
    ],
    questions: [],
    createdAt: new Date().toISOString()
  };

  const reordered = reorderQuestion(dummyPaper, 'sec-a', 0, 1);
  assert.equal(reordered.sections[0].questions[0].id, 'second-q');
  assert.equal(reordered.sections[0].questions[1].id, 'first-q');
});

test('Online Test Mode: Successfully converts SavedTestPaper into ExamModel with config, time limit, and questions', () => {
  const dummyPaper = {
    id: 'paper-online-test',
    userId: 'student_123',
    title: 'Final Term Practice Exam',
    subject: 'Algebra',
    durationMinutes: 45,
    totalMarks: 25,
    exerciseMode: 'mixed',
    sections: [],
    questions: [
      { id: 'q1', type: 'mcq', chapterId: 'c1', chapterName: 'Real Numbers', pageRef: 'p.15', difficulty: 'medium', bloomLevel: 'Apply', marks: 2, question: 'Solve x^2 = 4', correctAnswer: 'x = +-2', explanation: '', estimatedTimeSec: 90 }
    ],
    createdAt: new Date().toISOString()
  };

  const examModel = convertToExamModel(dummyPaper);
  assert.equal(examModel.id, 'paper-online-test');
  assert.equal(examModel.timeLimitMinutes, 45);
  assert.equal(examModel.totalMarks, 25);
  assert.equal(examModel.questions.length, 1);
  assert.equal(examModel.config.title, 'Final Term Practice Exam');
});

console.log(`\nALL ${passedTests} FEATURE 2 PIPELINE TESTS PASSED SUCCESSFULLY!\n`);
