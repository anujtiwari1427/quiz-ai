// Standalone verification script for EduPulse difficulty scoring and grading
import assert from 'node:assert/strict';

const DEFAULT_DIFFICULTY_WEIGHTS = {
  wMarks: 40,
  wTime: 30,
  wChanges: 15,
  wSkipped: 15
};

function computeQuestionDifficultyScore(params, weights = DEFAULT_DIFFICULTY_WEIGHTS) {
  const { marksAwarded, maxMarks, timeSpentSec, estimatedTimeSec, timesChanged, skipped } = params;
  const validMaxMarks = maxMarks > 0 ? maxMarks : 1;
  const validEstTime = estimatedTimeSec > 0 ? estimatedTimeSec : 60;

  const clampedMarksAwarded = Math.max(0, Math.min(marksAwarded, validMaxMarks));
  const performanceRatio = 1 - clampedMarksAwarded / validMaxMarks;
  const partMarks = weights.wMarks * performanceRatio;

  const timeRatio = Math.min(Math.max(0, timeSpentSec) / validEstTime, 2);
  const partTime = weights.wTime * (timeRatio / 2);

  const changeRatio = Math.min(Math.max(0, timesChanged), 3) / 3;
  const partChanges = weights.wChanges * changeRatio;

  const partSkipped = weights.wSkipped * (skipped ? 1 : 0);

  const rawScore = partMarks + partTime + partChanges + partSkipped;
  return Math.min(100, Math.max(0, Math.round(rawScore * 10) / 10));
}

function gradeObjectiveQuestion(userAnswer, correctAnswer, type) {
  const cleanUser = (userAnswer || '').trim().toLowerCase();
  const cleanCorrect = (correctAnswer || '').trim().toLowerCase();

  if (!cleanUser) return { isCorrect: false, confidence: 1 };
  if (type === 'mcq' || type === 'true_false') return { isCorrect: cleanUser === cleanCorrect, confidence: 1 };

  if (type === 'numerical') {
    const numUser = parseFloat(cleanUser.replace(/[^0-9.-]/g, ''));
    const numCorrect = parseFloat(cleanCorrect.replace(/[^0-9.-]/g, ''));
    if (!isNaN(numUser) && !isNaN(numCorrect)) {
      const diff = Math.abs(numUser - numCorrect);
      const isClose = numCorrect === 0 ? diff < 0.01 : (diff / Math.abs(numCorrect)) <= 0.02;
      return { isCorrect: isClose, confidence: 0.98 };
    }
  }
  return { isCorrect: cleanUser === cleanCorrect, confidence: cleanUser === cleanCorrect ? 1 : 0.85 };
}

console.log('🧪 Running EduPulse Assessment & Difficulty Scoring Tests...');

// Test 1: Perfect, swift answer
const test1 = computeQuestionDifficultyScore({
  marksAwarded: 5,
  maxMarks: 5,
  timeSpentSec: 30,
  estimatedTimeSec: 60,
  timesChanged: 0,
  skipped: false
});
assert.equal(test1, 7.5, `Test 1 failed: expected 7.5, got ${test1}`);
console.log('  ✓ Test 1: Swift perfect answer score = 7.5 (Time factor only)');

// Test 2: Maximum struggle
const test2 = computeQuestionDifficultyScore({
  marksAwarded: 0,
  maxMarks: 5,
  timeSpentSec: 150,
  estimatedTimeSec: 60,
  timesChanged: 5,
  skipped: true
});
assert.equal(test2, 100, `Test 2 failed: expected 100, got ${test2}`);
console.log('  ✓ Test 2: Maximum difficulty struggle = 100 (Full penalty capped)');

// Test 3: Custom weights
const customWeights = { wMarks: 50, wTime: 20, wChanges: 15, wSkipped: 15 };
const test3 = computeQuestionDifficultyScore(
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
assert.equal(test3, 50, `Test 3 failed: expected 50, got ${test3}`);
console.log('  ✓ Test 3: Custom configurable weights respected (50 marks weight)');

// Test 4: Objective grading
assert.equal(gradeObjectiveQuestion('Option B', 'Option B', 'mcq').isCorrect, true);
assert.equal(gradeObjectiveQuestion('Option A', 'Option B', 'mcq').isCorrect, false);
assert.equal(gradeObjectiveQuestion('TRUE', 'true', 'true_false').isCorrect, true);
assert.equal(gradeObjectiveQuestion('9.81', '9.8', 'numerical').isCorrect, true);
console.log('  ✓ Test 4: Objective grading for MCQ, True/False, and Numerical tolerance passed');

console.log('\n🎉 ALL 4 DIFFICULTY SCORING AND GRADING TESTS PASSED EMPIRICALLY!\n');
