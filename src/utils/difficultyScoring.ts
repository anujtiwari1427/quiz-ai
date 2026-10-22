import { DifficultyScoreWeights, DEFAULT_DIFFICULTY_WEIGHTS, ExamQuestionModel, AttemptAnswerModel } from '../types/schemas';

export interface ComputeDifficultyParams {
  marksAwarded: number;
  maxMarks: number;
  timeSpentSec: number;
  estimatedTimeSec: number;
  timesChanged: number;
  skipped: boolean;
}

/**
 * Computes Question Difficulty Score (0-100) using the exact prompt formula:
 * difficulty_score = 40*(1 - marks_awarded/marks)
 *                  + 30*min(time_spent/estimatedTime, 2)/2
 *                  + 15*min(times_changed, 3)/3
 *                  + 15*(skipped ? 1 : 0)
 *
 * Configurable weights default to 40, 30, 15, 15.
 */
export function computeQuestionDifficultyScore(
  params: ComputeDifficultyParams,
  weights: DifficultyScoreWeights = DEFAULT_DIFFICULTY_WEIGHTS
): number {
  const { marksAwarded, maxMarks, timeSpentSec, estimatedTimeSec, timesChanged, skipped } = params;

  const validMaxMarks = maxMarks > 0 ? maxMarks : 1;
  const validEstTime = estimatedTimeSec > 0 ? estimatedTimeSec : 60;

  // Component 1: Performance penalty
  const clampedMarksAwarded = Math.max(0, Math.min(marksAwarded, validMaxMarks));
  const performanceRatio = 1 - clampedMarksAwarded / validMaxMarks;
  const partMarks = weights.wMarks * performanceRatio;

  // Component 2: Time strain (capped at 2x expected time)
  const timeRatio = Math.min(Math.max(0, timeSpentSec) / validEstTime, 2);
  const partTime = weights.wTime * (timeRatio / 2);

  // Component 3: Hesitation / answer change count (capped at 3 changes)
  const changeRatio = Math.min(Math.max(0, timesChanged), 3) / 3;
  const partChanges = weights.wChanges * changeRatio;

  // Component 4: Skipped penalty
  const partSkipped = weights.wSkipped * (skipped ? 1 : 0);

  const rawScore = partMarks + partTime + partChanges + partSkipped;
  // Ensure clamped between 0 and 100 with 1 decimal precision
  return Math.min(100, Math.max(0, Math.round(rawScore * 10) / 10));
}

/**
 * Grades objective questions: MCQ, True/False, Fill in blanks, Numerical
 */
export function gradeObjectiveQuestion(
  userAnswer: string,
  correctAnswer: string,
  type: string
): { isCorrect: boolean; confidence: number } {
  const cleanUser = userAnswer.trim().toLowerCase();
  const cleanCorrect = correctAnswer.trim().toLowerCase();

  if (!cleanUser) {
    return { isCorrect: false, confidence: 1 };
  }

  if (type === 'mcq' || type === 'true_false') {
    return {
      isCorrect: cleanUser === cleanCorrect,
      confidence: 1
    };
  }

  if (type === 'numerical') {
    const numUser = parseFloat(cleanUser.replace(/[^0-9.-]/g, ''));
    const numCorrect = parseFloat(cleanCorrect.replace(/[^0-9.-]/g, ''));
    if (!isNaN(numUser) && !isNaN(numCorrect)) {
      // 2% tolerance for numerical rounding
      const diff = Math.abs(numUser - numCorrect);
      const isClose = numCorrect === 0 ? diff < 0.01 : (diff / Math.abs(numCorrect)) <= 0.02;
      return { isCorrect: isClose, confidence: 0.98 };
    }
  }

  // Fill in blanks / text match
  const matches = cleanUser === cleanCorrect;
  return {
    isCorrect: matches,
    confidence: matches ? 1 : 0.85
  };
}

/**
 * Calculates complete attempt summary: total score, breakdown, percentage
 */
export function calculateAttemptScoreSummary(
  questions: ExamQuestionModel[],
  userAnswers: { questionId: string; answer: string; timeSpentSec: number; timesChanged: number; markedReview: boolean }[],
  options?: { negativeMarking?: boolean; negativeValue?: number }
) {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;
  let totalTimeSpent = 0;

  const negValue = options?.negativeMarking ? (options.negativeValue ?? 0.25) : 0;

  const processedAnswers: AttemptAnswerModel[] = questions.map((q, idx) => {
    maxPossibleScore += q.marks;
    const ua = userAnswers.find(a => a.questionId === q.id);
    const ansText = ua ? ua.answer.trim() : '';
    const timeSpent = ua ? ua.timeSpentSec : 0;
    const timesChanged = ua ? ua.timesChanged : 0;
    const markedReview = ua ? ua.markedReview : false;
    totalTimeSpent += timeSpent;

    const isSkipped = ansText === '';
    let isCorrect = false;
    let marksAwarded = 0;

    if (isSkipped) {
      skippedCount++;
    } else {
      if (['mcq', 'true_false', 'fill_in_blank', 'numerical'].includes(q.type)) {
        const gradeResult = gradeObjectiveQuestion(ansText, q.correctAnswer, q.type);
        isCorrect = gradeResult.isCorrect;
        if (isCorrect) {
          marksAwarded = q.marks;
          correctCount++;
          totalScore += marksAwarded;
        } else {
          incorrectCount++;
          if (negValue > 0) {
            marksAwarded = -negValue;
            totalScore = Math.max(0, totalScore - negValue);
          }
        }
      } else {
        // Short / long answer baseline grading
        const len = ansText.length;
        if (len > 30) {
          marksAwarded = Number((q.marks * 0.8).toFixed(1));
          isCorrect = true;
          correctCount++;
        } else if (len > 10) {
          marksAwarded = Number((q.marks * 0.5).toFixed(1));
          isCorrect = true;
          correctCount++;
        } else {
          marksAwarded = 0;
          isCorrect = false;
          incorrectCount++;
        }
        totalScore += marksAwarded;
      }
    }

    const diffScore = computeQuestionDifficultyScore({
      marksAwarded,
      maxMarks: q.marks,
      timeSpentSec: timeSpent,
      estimatedTimeSec: q.estimatedTimeSec || 60,
      timesChanged,
      skipped: isSkipped
    });

    return {
      id: `ans_${idx}_${Date.now()}`,
      attemptId: '',
      questionId: q.id,
      answer: ansText,
      isCorrect,
      marksAwarded,
      timeSpentSec: timeSpent,
      timesChanged,
      markedReview,
      difficultyScore: diffScore,
      aiFeedback: isCorrect ? 'Great answer! Concept accurately applied.' : `Review chapter: ${q.chapterName} (Page: ${q.pageRef})`
    };
  });

  const percentage = maxPossibleScore > 0 ? Math.round((Math.max(0, totalScore) / maxPossibleScore) * 100) : 0;

  return {
    totalScore: Math.round(totalScore * 10) / 10,
    maxPossibleScore,
    percentage,
    correctCount,
    incorrectCount,
    skippedCount,
    totalTimeSpent,
    processedAnswers
  };
}
