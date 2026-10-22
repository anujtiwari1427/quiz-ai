import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { computeQuestionDifficultyScore, gradeObjectiveQuestion, calculateAttemptScoreSummary } from '../difficultyScoring';
import { DEFAULT_DIFFICULTY_WEIGHTS } from '../../types/schemas';

describe('Difficulty Scoring & Performance Formula Tests', () => {
  it('computes 0 difficulty score for a perfect, swift, confident answer', () => {
    // 0 penalties across all dimensions
    const score = computeQuestionDifficultyScore({
      marksAwarded: 5,
      maxMarks: 5,
      timeSpentSec: 30, // less than estimated time
      estimatedTimeSec: 60,
      timesChanged: 0,
      skipped: false
    });
    // Marks: 40 * (1 - 5/5) = 0
    // Time: 30 * min(30/60, 2)/2 = 30 * 0.5 / 2 = 7.5
    // Changes: 15 * 0 = 0
    // Skipped: 0
    assert.equal(score, 7.5);
  });

  it('computes near 100 difficulty score for maximum struggle (skipped / 0 marks / long time / many changes)', () => {
    const score = computeQuestionDifficultyScore({
      marksAwarded: 0,
      maxMarks: 5,
      timeSpentSec: 150, // exceeds 2x estimatedTime (60)
      estimatedTimeSec: 60,
      timesChanged: 4, // exceeds 3 changes
      skipped: true
    });
    // Marks: 40 * (1 - 0) = 40
    // Time: 30 * (min(150/60, 2) / 2) = 30 * (2/2) = 30
    // Changes: 15 * (min(4, 3) / 3) = 15 * (3/3) = 15
    // Skipped: 15 * 1 = 15
    // Total = 40 + 30 + 15 + 15 = 100
    assert.equal(score, 100);
  });

  it('respects custom configurable weights', () => {
    const customWeights = {
      wMarks: 50,
      wTime: 20,
      wChanges: 15,
      wSkipped: 15
    };
    const score = computeQuestionDifficultyScore(
      {
        marksAwarded: 0,
        maxMarks: 10,
        timeSpentSec: 0,
        estimatedTimeSec: 60,
        timesChanged: 0,
        skipped: false
      },
      customWeights
    );
    // Marks: 50 * 1 = 50. Others = 0
    assert.equal(score, 50);
  });

  it('correctly grades objective questions', () => {
    assert.equal(gradeObjectiveQuestion('Paris', 'Paris', 'mcq').isCorrect, true);
    assert.equal(gradeObjectiveQuestion('London', 'Paris', 'mcq').isCorrect, false);
    assert.equal(gradeObjectiveQuestion('true', 'True', 'true_false').isCorrect, true);
    assert.equal(gradeObjectiveQuestion('42.0', '42', 'numerical').isCorrect, true);
  });
});
