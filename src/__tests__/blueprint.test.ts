import { describe, it, expect } from 'vitest';
import { BLUEPRINT_SERVICE } from '../services/blueprintService';
import { PaperBlueprint } from '../types';

describe('Blueprint Arithmetic & Validation', () => {
  const validBlueprint: PaperBlueprint = {
    id: 'test-bp-1',
    name: 'Standard Class 10 Science',
    board: 'CBSE',
    grade: 10,
    subject: 'Science',
    examName: 'Annual Board Exam',
    schoolName: 'Delhi Public School',
    durationMinutes: 180,
    totalMarks: 50,
    generalInstructions: ['All questions are compulsory.'],
    sections: [
      {
        id: 's1',
        name: 'Section A',
        title: 'Multiple Choice Questions',
        questionType: 'mcq',
        questionCount: 10,
        marksPerQuestion: 1
      },
      {
        id: 's2',
        name: 'Section B',
        title: 'Short Answer Type I',
        questionType: 'short_answer',
        questionCount: 10,
        marksPerQuestion: 2
      },
      {
        id: 's3',
        name: 'Section C',
        title: 'Long Answer Type',
        questionType: 'long_answer',
        questionCount: 4,
        marksPerQuestion: 5
      }
    ],
    chapterWeightages: [
      { chapterName: 'Chemical Reactions and Equations', weightagePercent: 40 },
      { chapterName: 'Acids, Bases and Salts', weightagePercent: 30 },
      { chapterName: 'Life Processes', weightagePercent: 30 }
    ],
    difficultySplit: {
      easy: 30,
      medium: 50,
      hard: 20
    },
    language: 'English',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  it('validates a mathematically consistent blueprint with 100% chapter weightage and exact marks', () => {
    // 10*1 + 10*2 + 4*5 = 10 + 20 + 20 = 50 Marks (exact match)
    // 40 + 30 + 30 = 100% chapter weightage
    // 30 + 50 + 20 = 100% difficulty split
    const result = BLUEPRINT_SERVICE.validateBlueprint(validBlueprint);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.calculatedMarks).toBe(50);
  });

  it('rejects a blueprint when section marks sum does not equal totalMarks', () => {
    const invalidBlueprint: PaperBlueprint = {
      ...validBlueprint,
      totalMarks: 60 // But sections sum to 50
    };
    const result = BLUEPRINT_SERVICE.validateBlueprint(invalidBlueprint);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Total marks mismatch'))).toBe(true);
  });

  it('rejects a blueprint when chapter weightage does not sum to 100%', () => {
    const invalidWeightage: PaperBlueprint = {
      ...validBlueprint,
      chapterWeightages: [
        { chapterName: 'Chapter 1', weightagePercent: 50 },
        { chapterName: 'Chapter 2', weightagePercent: 40 } // Sum = 90%
      ]
    };
    const result = BLUEPRINT_SERVICE.validateBlueprint(invalidWeightage);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('must sum to 100%'))).toBe(true);
  });

  it('rejects a blueprint when difficulty split does not sum to 100%', () => {
    const invalidDifficulty: PaperBlueprint = {
      ...validBlueprint,
      difficultySplit: {
        easy: 40,
        medium: 40,
        hard: 10 // Sum = 90%
      }
    };
    const result = BLUEPRINT_SERVICE.validateBlueprint(invalidDifficulty);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Difficulty split'))).toBe(true);
  });

  it('rejects a section with 0 or negative question count', () => {
    const zeroSection: PaperBlueprint = {
      ...validBlueprint,
      sections: [
        {
          id: 's1',
          name: 'Section A',
          title: 'Empty Section',
          questionType: 'mcq',
          questionCount: 0,
          marksPerQuestion: 1
        }
      ]
    };
    const result = BLUEPRINT_SERVICE.validateBlueprint(zeroSection);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Question count must be at least 1'))).toBe(true);
  });

  it('correctly calculates marks with internal choices', () => {
    const choiceBlueprint: PaperBlueprint = {
      ...validBlueprint,
      totalMarks: 40,
      sections: [
        {
          id: 's1',
          name: 'Section A',
          title: 'MCQs',
          questionType: 'mcq',
          questionCount: 10,
          marksPerQuestion: 1 // 10 Marks
        },
        {
          id: 's2',
          name: 'Section B',
          title: 'Choice Questions',
          questionType: 'short_answer',
          questionCount: 12,        // 12 questions provided
          internalChoiceCount: 2,   // 2 internal choices (attempt 10)
          marksPerQuestion: 3       // 10 * 3 = 30 Marks
        }
      ]
    };
    // 10 + 30 = 40 Marks
    const result = BLUEPRINT_SERVICE.validateBlueprint(choiceBlueprint);
    expect(result.isValid).toBe(true);
    expect(result.calculatedMarks).toBe(40);
  });
});
