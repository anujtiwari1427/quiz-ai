import { 
  AttemptModel, 
  AttemptAnswerModel, 
  ExamModel, 
  ExamQuestionModel,
  AIStudyPlan,
  DifficultyScoreWeights,
  DEFAULT_DIFFICULTY_WEIGHTS
} from '../types/schemas';
import { computeQuestionDifficultyScore, calculateAttemptScoreSummary } from '../utils/difficultyScoring';
import { LIBRARY_SERVICE } from './libraryService';

const ATTEMPTS_STORAGE_KEY = 'edupulse_attempts_store';

export interface HardestQuestionItem {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  timeSpentSec: number;
  estimatedTimeSec: number;
  chapterName: string;
  pageRef: string;
  difficultyScore: number;
  classWideAccuracyPct: number;
}

export interface ChapterMasteryItem {
  chapterName: string;
  totalMarksPossible: number;
  marksObtained: number;
  percentage: number;
  status: 'Weak' | 'Average' | 'Strong';
  questionsCount: number;
  wrongCount: number;
  avgTimeSpentSec: number;
  expectedTimeSec: number;
}

export interface ChapterToImproveItem {
  chapterName: string;
  percentage: number;
  whyWeakReason: string;
  missedSubtopics: string[];
  pagesToRevisit: string[];
}

export interface ComprehensiveAnalysisResult {
  attemptId: string;
  examTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTakenSec: number;
  timeAllowedSec: number;
  percentile: number;
  accuracyByType: { [type: string]: { correct: number; total: number; pct: number } };
  accuracyByDifficulty: { [diff: string]: { correct: number; total: number; pct: number } };
  hardestQuestions: HardestQuestionItem[];
  chapterMastery: ChapterMasteryItem[];
  chaptersToImprove: ChapterToImproveItem[];
  aiStudyPlan: AIStudyPlan;
  trendHistory: { attemptNumber: number; date: string; scorePct: number }[];
}

export const GRADING_AND_ANALYSIS_SERVICE = {
  getStoredAttempts(): AttemptModel[] {
    try {
      const data = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAttempt(attempt: AttemptModel): void {
    try {
      const list = this.getStoredAttempts();
      const idx = list.findIndex(a => a.id === attempt.id);
      if (idx >= 0) {
        list[idx] = attempt;
      } else {
        list.unshift(attempt);
      }
      localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save attempt', e);
    }
  },

  getAttemptById(attemptId: string): AttemptModel | undefined {
    return this.getStoredAttempts().find(a => a.id === attemptId);
  },

  /**
   * Evaluates and records exam submission:
   * Correct answers are NEVER exposed before this step.
   */
  submitExamAttempt(
    exam: ExamModel,
    rawAnswers: {
      questionId: string;
      answer: string;
      timeSpentSec: number;
      timesChanged: number;
      markedReview: boolean;
    }[],
    weights: DifficultyScoreWeights = DEFAULT_DIFFICULTY_WEIGHTS
  ): AttemptModel {
    const summary = calculateAttemptScoreSummary(exam.questions, rawAnswers, {
      negativeMarking: exam.config.negativeMarking,
      negativeValue: exam.config.negativeMarkingValue
    });

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const evaluatedAnswers: AttemptAnswerModel[] = summary.processedAnswers.map(ans => ({
      ...ans,
      attemptId
    }));

    const attempt: AttemptModel = {
      id: attemptId,
      examId: exam.id,
      userId: LIBRARY_SERVICE.getCurrentUserId(),
      startedAt: new Date(Date.now() - summary.totalTimeSpent * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      score: summary.totalScore,
      total: summary.maxPossibleScore,
      timeSpentSeconds: summary.totalTimeSpent,
      status: 'submitted',
      answers: evaluatedAnswers,
      createdAt: new Date().toISOString()
    };

    this.saveAttempt(attempt);
    return attempt;
  },

  /**
   * Builds the comprehensive diagnostic analysis for the student
   */
  generateAnalysis(
    exam: ExamModel,
    attempt: AttemptModel
  ): ComprehensiveAnalysisResult {
    const answers = attempt.answers;
    const questions = exam.questions;

    // 1. Overall Metrics
    const timeAllowedSec = exam.timeLimitMinutes * 60;
    const score = attempt.score;
    const totalMarks = attempt.total || exam.totalMarks;
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    // Percentile rank estimate
    const percentile = Math.min(99, Math.max(10, Math.round(percentage * 0.95 + 4)));

    // Accuracy by type
    const accuracyByType: { [type: string]: { correct: number; total: number; pct: number } } = {};
    const accuracyByDifficulty: { [diff: string]: { correct: number; total: number; pct: number } } = {};

    questions.forEach(q => {
      const ans = answers.find(a => a.questionId === q.id);
      const isCorrect = ans?.isCorrect || false;

      // By type
      if (!accuracyByType[q.type]) {
        accuracyByType[q.type] = { correct: 0, total: 0, pct: 0 };
      }
      accuracyByType[q.type].total++;
      if (isCorrect) accuracyByType[q.type].correct++;

      // By difficulty
      if (!accuracyByDifficulty[q.difficulty]) {
        accuracyByDifficulty[q.difficulty] = { correct: 0, total: 0, pct: 0 };
      }
      accuracyByDifficulty[q.difficulty].total++;
      if (isCorrect) accuracyByDifficulty[q.difficulty].correct++;
    });

    Object.keys(accuracyByType).forEach(t => {
      const item = accuracyByType[t];
      item.pct = Math.round((item.correct / item.total) * 100);
    });

    Object.keys(accuracyByDifficulty).forEach(d => {
      const item = accuracyByDifficulty[d];
      item.pct = Math.round((item.correct / item.total) * 100);
    });

    // 2. Hardest Questions (Top 5 sorted by Difficulty Score)
    const allAttempts = this.getStoredAttempts().filter(a => a.examId === exam.id);
    const hardestQuestions: HardestQuestionItem[] = questions.map(q => {
      const ans = answers.find(a => a.questionId === q.id);
      const diffScore = ans?.difficultyScore || 0;

      // Compute class-wide % correct across attempts
      let classCorrectCount = 0;
      let classTotalAttempts = 0;
      allAttempts.forEach(att => {
        const matchingAns = att.answers.find(a => a.questionId === q.id);
        if (matchingAns) {
          classTotalAttempts++;
          if (matchingAns.isCorrect) classCorrectCount++;
        }
      });
      const classWidePct = classTotalAttempts > 0
        ? Math.round((classCorrectCount / classTotalAttempts) * 100)
        : (ans?.isCorrect ? 85 : 45);

      return {
        questionId: q.id,
        questionText: q.question,
        studentAnswer: ans?.answer || '(No answer provided / Skipped)',
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || 'Refer to curriculum textbook principles.',
        timeSpentSec: ans?.timeSpentSec || 0,
        estimatedTimeSec: q.estimatedTimeSec || 60,
        chapterName: q.chapterName,
        pageRef: q.pageRef || 'Page 1',
        difficultyScore: diffScore,
        classWideAccuracyPct: classWidePct
      };
    })
    .sort((a, b) => b.difficultyScore - a.difficultyScore)
    .slice(0, 5);

    // 3. Chapter-Wise Mastery
    const chapterMap: { [name: string]: { total: number; scored: number; qCount: number; wrongCount: number; timeSpent: number; estTime: number } } = {};

    questions.forEach(q => {
      const ans = answers.find(a => a.questionId === q.id);
      const chName = q.chapterName || 'General';
      if (!chapterMap[chName]) {
        chapterMap[chName] = { total: 0, scored: 0, qCount: 0, wrongCount: 0, timeSpent: 0, estTime: 0 };
      }
      chapterMap[chName].total += q.marks;
      chapterMap[chName].scored += ans?.marksAwarded || 0;
      chapterMap[chName].qCount += 1;
      chapterMap[chName].timeSpent += ans?.timeSpentSec || 0;
      chapterMap[chName].estTime += q.estimatedTimeSec || 60;
      if (!ans?.isCorrect) {
        chapterMap[chName].wrongCount += 1;
      }
    });

    const chapterMastery: ChapterMasteryItem[] = Object.keys(chapterMap).map(chName => {
      const data = chapterMap[chName];
      const chPct = data.total > 0 ? Math.round((data.scored / data.total) * 100) : 0;
      let status: 'Weak' | 'Average' | 'Strong' = 'Average';
      if (chPct < 50) status = 'Weak';
      else if (chPct > 75) status = 'Strong';

      return {
        chapterName: chName,
        totalMarksPossible: data.total,
        marksObtained: Math.round(data.scored * 10) / 10,
        percentage: chPct,
        status,
        questionsCount: data.qCount,
        wrongCount: data.wrongCount,
        avgTimeSpentSec: Math.round(data.timeSpent / (data.qCount || 1)),
        expectedTimeSec: Math.round(data.estTime / (data.qCount || 1))
      };
    }).sort((a, b) => a.percentage - b.percentage);

    // 4. Chapters to Improve
    const chaptersToImprove: ChapterToImproveItem[] = chapterMastery
      .filter(cm => cm.status === 'Weak' || cm.wrongCount > 0)
      .map(cm => {
        const wrongQs = questions.filter(q => q.chapterName === cm.chapterName && !answers.find(a => a.questionId === q.id)?.isCorrect);
        const pages = Array.from(new Set(wrongQs.map(q => q.pageRef || 'Page 1')));
        const subtopics = Array.from(new Set(wrongQs.map(q => {
          if (q.type === 'mcq') return 'Core Definitions & Conditions';
          if (q.type === 'numerical') return 'Formula Calculation & Precision';
          return 'Subjective Proofs & Theoretical Explanations';
        })));

        const timeRatio = (cm.avgTimeSpentSec / (cm.expectedTimeSec || 1)).toFixed(1);
        const reason = `${cm.wrongCount} of ${cm.questionsCount} questions wrong (Accuracy: ${cm.percentage}%), avg time ${timeRatio}x expected`;

        return {
          chapterName: cm.chapterName,
          percentage: cm.percentage,
          whyWeakReason: reason,
          missedSubtopics: subtopics.length > 0 ? subtopics : ['Foundational Concept Recall'],
          pagesToRevisit: pages.length > 0 ? pages : ['Page 12', 'Page 24']
        };
      });

    // 5. AI Study Plan Generation
    let carelessCount = 0;
    let conceptGapCount = 0;
    let timePressureCount = 0;

    answers.forEach(a => {
      const q = questions.find(item => item.id === a.questionId);
      if (!a.isCorrect && q) {
        if (a.timesChanged >= 2) carelessCount++;
        else if (a.timeSpentSec < (q.estimatedTimeSec || 60) * 0.4) carelessCount++;
        else if (a.timeSpentSec > (q.estimatedTimeSec || 60) * 1.5) timePressureCount++;
        else conceptGapCount++;
      }
    });

    const tips: string[] = [];
    if (carelessCount > 0) {
      tips.push('Careless Error Prevention: Re-read the negative clauses ("NOT", "EXCEPT") in stems before submitting.');
    } else {
      tips.push('Active Recall: Summarize each section formula in your own words before attempting questions.');
    }

    if (conceptGapCount > 0 || percentage < 65) {
      tips.push(`Address Gaps: Re-read textbook pages ${chaptersToImprove[0]?.pagesToRevisit?.join(', ') || '1-15'} to strengthen foundational definitions.`);
    } else {
      tips.push('Deepen Mastery: Practice higher-order evaluation questions on Bloom’s taxonomy levels.');
    }

    if (timePressureCount > 0) {
      tips.push('Time Pacing: Keep an internal timer of 60s per objective question; mark doubtful questions for review instead of getting stuck.');
    } else {
      tips.push('Mock Simulation: Take timed chapter-specific quizzes to maintain cognitive stamina.');
    }

    const aiStudyPlan: AIStudyPlan = {
      priorityChapters: chaptersToImprove.slice(0, 3).map(c => c.chapterName),
      topicsToRevise: chaptersToImprove.flatMap(c => c.missedSubtopics).slice(0, 4),
      suggestedDailyMinutes: percentage < 50 ? 45 : percentage < 75 ? 30 : 20,
      tips: tips.slice(0, 3) as [string, string, string]
    };

    // 6. Progress Over Time
    const userAttempts = this.getStoredAttempts().filter(a => a.userId === attempt.userId);
    const trendHistory = userAttempts.map((att, i) => ({
      attemptNumber: i + 1,
      date: new Date(att.submittedAt || att.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      scorePct: att.total > 0 ? Math.round((att.score / att.total) * 100) : 0
    })).slice(0, 10);

    if (trendHistory.length === 0) {
      trendHistory.push({
        attemptNumber: 1,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        scorePct: percentage
      });
    }

    return {
      attemptId: attempt.id,
      examTitle: exam.title,
      score,
      totalMarks,
      percentage,
      timeTakenSec: attempt.timeSpentSeconds,
      timeAllowedSec,
      percentile,
      accuracyByType,
      accuracyByDifficulty,
      hardestQuestions,
      chapterMastery,
      chaptersToImprove,
      aiStudyPlan,
      trendHistory
    };
  }
};
