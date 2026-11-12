import { describe, it, expect } from 'vitest';
import { AI_PROVIDER_SERVICE } from '../services/aiProviderService';

describe('MCQ Validation & JSON Repair Invariants', () => {
  const fallback = {
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    chapterName: 'Chemical Reactions and Equations'
  };

  it('successfully parses clean JSON conforming to schema', () => {
    const raw = JSON.stringify({
      text: 'Which gas is released during photosynthesis?',
      type: 'mcq',
      marks: 1,
      difficulty: 'easy',
      bloomLevel: 'Remember',
      options: [
        { id: '1', text: 'Oxygen', isCorrect: true },
        { id: '2', text: 'Carbon Dioxide', isCorrect: false },
        { id: '3', text: 'Nitrogen', isCorrect: false },
        { id: '4', text: 'Hydrogen', isCorrect: false }
      ],
      answer: 'Oxygen is released during the light reaction of photosynthesis.',
      markingScheme: '1 mark for correct identification of Oxygen.'
    });

    const parsed = AI_PROVIDER_SERVICE.parseAndRepairQuestionJson(raw, fallback);
    expect(parsed.text).toBe('Which gas is released during photosynthesis?');
    expect(parsed.options).toHaveLength(4);
    expect(parsed.options?.filter(o => o.isCorrect)).toHaveLength(1);
    expect(parsed.options?.find(o => o.isCorrect)?.text).toBe('Oxygen');
  });

  it('repairs markdown code fences and trailing commas', () => {
    const rawWithFencesAndCommas = `
    \`\`\`json
    {
      "text": "What is the pH of pure water at 25°C?",
      "options": [
        { "id": "o1", "text": "7", "isCorrect": true },
        { "id": "o2", "text": "1", "isCorrect": false },
        { "id": "o3", "text": "14", "isCorrect": false },
        { "id": "o4", "text": "0", "isCorrect": false },
      ],
      "answer": "Pure water has a neutral pH of 7.",
      "markingScheme": "1 mark for 7.",
    }
    \`\`\`
    `;

    const parsed = AI_PROVIDER_SERVICE.parseAndRepairQuestionJson(rawWithFencesAndCommas, fallback);
    expect(parsed.text).toContain('pH of pure water');
    expect(parsed.options).toHaveLength(4);
    expect(parsed.options?.find(o => o.isCorrect)?.text).toBe('7');
  });

  it('normalizes MCQ options to exactly 4 when LLM outputs fewer options', () => {
    const rawUnderOptions = JSON.stringify({
      text: 'Which metal is liquid at room temperature?',
      options: [
        { id: '1', text: 'Mercury', isCorrect: true },
        { id: '2', text: 'Sodium', isCorrect: false }
      ],
      answer: 'Mercury',
      markingScheme: '1 mark'
    });

    const parsed = AI_PROVIDER_SERVICE.parseAndRepairQuestionJson(rawUnderOptions, fallback);
    expect(parsed.options).toHaveLength(4);
    const correctOptions = parsed.options?.filter(o => o.isCorrect);
    expect(correctOptions).toHaveLength(1);
    expect(correctOptions?.[0].text).toBe('Mercury');
  });

  it('ensures exactly 1 correct answer when LLM marks multiple as correct', () => {
    const rawMultiCorrect = JSON.stringify({
      text: 'Which of the following is a greenhouse gas?',
      options: [
        { id: '1', text: 'Carbon Dioxide', isCorrect: true },
        { id: '2', text: 'Methane', isCorrect: true },
        { id: '3', text: 'Argon', isCorrect: true },
        { id: '4', text: 'Oxygen', isCorrect: false }
      ],
      answer: 'Carbon Dioxide',
      markingScheme: '1 mark'
    });

    const parsed = AI_PROVIDER_SERVICE.parseAndRepairQuestionJson(rawMultiCorrect, fallback);
    expect(parsed.options).toHaveLength(4);
    const correct = parsed.options?.filter(o => o.isCorrect);
    // Enforced invariant: exactly 1 correct answer
    expect(correct).toHaveLength(1);
  });

  it('estimates token cost deterministically', () => {
    const estimate = AI_PROVIDER_SERVICE.estimateTokenCost(5, 10);
    expect(estimate.estimatedTokens).toBeGreaterThan(0);
    expect(estimate.estimatedCostUSD).toBeDefined();
  });
});
