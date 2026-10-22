import { Flashcard, CardRating, MasteryState, RetentionDataPoint } from '../types/strater';

export const SM2_CONFIG = {
  MIN_EASE_FACTOR: 1.3,
  DEFAULT_EASE_FACTOR: 2.5,
  MAX_INTERVAL_DAYS: 365
};

export interface SM2Result {
  repetitionNumber: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string; // YYYY-MM-DD
  masteryState: MasteryState;
}

/**
 * SuperMemo SM-2 Algorithmic Engine for Spaced Repetition Learning
 */
export const SM2_SERVICE = {
  /**
   * Convert friendly UI rating to SM-2 numeric grade (0-5)
   */
  ratingToGrade(rating: CardRating): number {
    switch (rating) {
      case 'again':
        return 1; // Complete blackout / fail
      case 'hard':
        return 3; // Correct with significant hesitation
      case 'good':
        return 4; // Correct with slight hesitation
      case 'easy':
        return 5; // Perfect recall without hesitation
      default:
        return 4;
    }
  },

  /**
   * Calculate next review schedule using SM-2 algorithm
   */
  calculateNextSchedule(card: Flashcard, rating: CardRating, currentDate: Date = new Date()): SM2Result {
    const q = this.ratingToGrade(rating);
    let { repetitionNumber, intervalDays, easeFactor } = card;

    // Ensure default initial values
    if (typeof repetitionNumber !== 'number') repetitionNumber = 0;
    if (typeof intervalDays !== 'number') intervalDays = 1;
    if (typeof easeFactor !== 'number' || easeFactor < SM2_CONFIG.MIN_EASE_FACTOR) {
      easeFactor = SM2_CONFIG.DEFAULT_EASE_FACTOR;
    }

    let nextRepetition: number;
    let nextInterval: number;
    let nextEaseFactor: number;
    let nextMastery: MasteryState;

    if (q < 3) {
      // Failed recall -> Reset repetition cycle
      nextRepetition = 0;
      nextInterval = 1; // review again tomorrow (or in 1 day)
      // Slight EF penalty
      nextEaseFactor = Math.max(SM2_CONFIG.MIN_EASE_FACTOR, easeFactor - 0.2);
      nextMastery = 'learning';
    } else {
      // SuperMemo-2 Ease Factor formula:
      // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
      const deltaEF = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
      nextEaseFactor = Math.max(SM2_CONFIG.MIN_EASE_FACTOR, Number((easeFactor + deltaEF).toFixed(2)));

      // Successful recall
      if (repetitionNumber === 0) {
        nextInterval = 1;
      } else if (repetitionNumber === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(intervalDays * nextEaseFactor);
      }

      // Cap interval to reasonable maximum
      nextInterval = Math.min(SM2_CONFIG.MAX_INTERVAL_DAYS, Math.max(1, nextInterval));
      nextRepetition = repetitionNumber + 1;

      if (nextRepetition >= 4) {
        nextMastery = 'mastered';
      } else if (nextRepetition >= 2) {
        nextMastery = 'reviewing';
      } else {
        nextMastery = 'learning';
      }
    }

    // Calculate next review date
    const targetDate = new Date(currentDate);
    targetDate.setDate(targetDate.getDate() + nextInterval);
    const nextReviewDate = targetDate.toISOString().split('T')[0];

    return {
      repetitionNumber: nextRepetition,
      intervalDays: nextInterval,
      easeFactor: nextEaseFactor,
      nextReviewDate,
      masteryState: nextMastery
    };
  },

  /**
   * Filter cards that are due for review today or overdue
   */
  filterDueToday(cards: Flashcard[], todayDateString: string = new Date().toISOString().split('T')[0]): Flashcard[] {
    return cards.filter(card => {
      if (!card.nextReviewDate) return true;
      return card.nextReviewDate <= todayDateString;
    });
  },

  /**
   * Generate Ebbinghaus Forgetting Curve comparison data
   */
  generateForgettingCurveData(daysToProject: number = 30): RetentionDataPoint[] {
    const points: RetentionDataPoint[] = [];

    for (let day = 0; day <= daysToProject; day++) {
      // Standard Ebbinghaus decay: R = e^(-t/S)
      // Without review, memory decays rapidly to ~20%
      const unassisted = Math.round(100 * Math.exp(-day / 4));

      // With SM-2 spaced repetition (reinforcements on day 1, 3, 7, 14, 30):
      let spaced = 100;
      if (day > 0 && day <= 2) spaced = Math.max(88, 100 - day * 6);
      else if (day <= 7) spaced = Math.max(85, 96 - (day - 3) * 2.5);
      else if (day <= 14) spaced = Math.max(89, 97 - (day - 7) * 1.2);
      else spaced = Math.max(92, 98 - (day - 14) * 0.4);

      points.push({
        day,
        unassistedRetention: Math.max(12, unassisted),
        spacedRepetitionRetention: Math.min(100, Math.round(spaced))
      });
    }

    return points;
  }
};
