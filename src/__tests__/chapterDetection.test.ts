import { describe, it, expect } from 'vitest';
import { CHAPTER_HEADER_REGEX, EXERCISE_HEADER_REGEX } from '../services/ingestionService';

describe('Chapter & Exercise Detection Regexes', () => {
  it('detects standard CBSE / NCERT chapter headings', () => {
    const text1 = 'CHAPTER 1: Chemical Reactions and Equations';
    const match1 = text1.match(CHAPTER_HEADER_REGEX);
    expect(match1).not.toBeNull();
    expect(match1?.[1]).toBe('1');
    expect(match1?.[2].trim()).toBe('Chemical Reactions and Equations');

    const text2 = 'Unit 4 - Carbon and its Compounds';
    const match2 = text2.match(CHAPTER_HEADER_REGEX);
    expect(match2).not.toBeNull();
    expect(match2?.[1]).toBe('4');
    expect(match2?.[2].trim()).toBe('Carbon and its Compounds');
  });

  it('detects Roman numeral chapter headings', () => {
    const text = 'Chapter IV. Periodic Classification of Elements';
    const match = text.match(CHAPTER_HEADER_REGEX);
    expect(match).not.toBeNull();
    expect(match?.[1].toUpperCase()).toBe('IV');
    expect(match?.[2].trim()).toBe('Periodic Classification of Elements');
  });

  it('detects Hindi/Marathi transliterated chapter tags (Paath / Adhyay)', () => {
    const text = 'Paath 3 Gurutvakarshan (Gravitation)';
    const match = text.match(CHAPTER_HEADER_REGEX);
    expect(match).not.toBeNull();
    expect(match?.[1]).toBe('3');
  });

  it('detects textbook exercise and practice set headers', () => {
    const ex1 = 'Exercises 1.1';
    expect(ex1.match(EXERCISE_HEADER_REGEX)).not.toBeNull();

    const ex2 = 'Practice Set 2.3';
    expect(ex2.match(EXERCISE_HEADER_REGEX)).not.toBeNull();

    const ex3 = 'Review Questions';
    expect(ex3.match(EXERCISE_HEADER_REGEX)).not.toBeNull();

    const ex4 = 'Test Your Knowledge';
    expect(ex4.match(EXERCISE_HEADER_REGEX)).not.toBeNull();
  });
});
