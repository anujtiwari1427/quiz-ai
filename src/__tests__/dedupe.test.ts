import { describe, it, expect } from 'vitest';
import { calculateJaccardSimilarity, INGESTION_SERVICE, sanitizeFilename } from '../services/ingestionService';
import { QuestionItem } from '../types';

describe('Question Deduplication & Jaccard Similarity', () => {
  it('returns 1.0 similarity for identical text', () => {
    const textA = 'What is the law of conservation of mass?';
    const textB = 'What is the law of conservation of mass?';
    const score = calculateJaccardSimilarity(textA, textB);
    expect(score).toBe(1.0);
  });

  it('returns 0.0 similarity for completely disjoint text', () => {
    const textA = 'photosynthesis occurs in plants';
    const textB = 'gravitational constant calculation formula';
    const score = calculateJaccardSimilarity(textA, textB);
    expect(score).toBe(0.0);
  });

  it('detects high similarity (> 0.75) for minor variations and punctuation differences', () => {
    const textA = 'State Ohm’s law and write its mathematical equation.';
    const textB = 'State Ohms law and write its mathematical equation?';
    const score = calculateJaccardSimilarity(textA, textB);
    expect(score).toBeGreaterThan(0.75);
  });

  it('finds duplicate questions in a list exceeding the threshold', () => {
    const q1: QuestionItem = {
      id: 'q1',
      text: 'Define oxidation and reduction with suitable chemical examples.',
      type: 'short_answer',
      marks: 3,
      difficulty: 'medium',
      bloomLevel: 'Understand',
      subject: 'Chemistry',
      grade: 10,
      board: 'CBSE',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const q2: QuestionItem = {
      id: 'q2',
      text: 'Define oxidation and reduction with suitable chemical examples.',
      type: 'short_answer',
      marks: 3,
      difficulty: 'medium',
      bloomLevel: 'Understand',
      subject: 'Chemistry',
      grade: 10,
      board: 'CBSE',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const q3: QuestionItem = {
      id: 'q3',
      text: 'Explain the working principle of an electric motor with a labeled diagram.',
      type: 'long_answer',
      marks: 5,
      difficulty: 'hard',
      bloomLevel: 'Apply',
      subject: 'Physics',
      grade: 10,
      board: 'CBSE',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const duplicates = INGESTION_SERVICE.findDuplicates([q1, q2, q3], 0.75);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].original.id).toBe('q1');
    expect(duplicates[0].duplicate.id).toBe('q2');
    expect(duplicates[0].similarity).toBeGreaterThanOrEqual(75);
  });

  it('sanitizes unsafe filenames for local storage', () => {
    const dirty = '../../etc/passwd&&malicious*.pdf';
    const cleaned = sanitizeFilename(dirty);
    expect(cleaned).not.toContain('..');
    expect(cleaned).not.toContain('/');
    expect(cleaned).not.toContain('*');
    expect(cleaned).not.toContain('&');
  });
});
