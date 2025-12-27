// SM-2 Spaced Repetition Algorithm
// Based on: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2

export interface CardState {
  wordId: number;
  easinessFactor: number; // EF, starts at 2.5
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews in a row
  nextReviewDate: string; // ISO date string
  lastReviewDate: string | null;
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export const QUALITY_LABELS: Record<Quality, { label: string; description: string }> = {
  0: { label: "Blackout", description: "Complete failure to recall" },
  1: { label: "Wrong", description: "Incorrect, but recognized after" },
  2: { label: "Hard", description: "Incorrect, but easy to recall" },
  3: { label: "Difficult", description: "Correct with serious difficulty" },
  4: { label: "Good", description: "Correct after hesitation" },
  5: { label: "Perfect", description: "Perfect response" },
};

export function createInitialCardState(wordId: number): CardState {
  return {
    wordId,
    easinessFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: null,
  };
}

export function calculateNextReview(
  currentState: CardState,
  quality: Quality
): CardState {
  const { easinessFactor, interval, repetitions } = currentState;
  
  let newEF = easinessFactor;
  let newInterval: number;
  let newRepetitions: number;

  // Calculate new easiness factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEF = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // EF should never be less than 1.3
  if (newEF < 1.3) {
    newEF = 1.3;
  }

  // If quality < 3, reset repetitions (failure)
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1; // Review again tomorrow
  } else {
    // Successful recall
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1; // First successful review: 1 day
    } else if (newRepetitions === 2) {
      newInterval = 6; // Second successful review: 6 days
    } else {
      // Subsequent reviews: interval * EF
      newInterval = Math.round(interval * newEF);
    }
  }

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    wordId: currentState.wordId,
    easinessFactor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate: nextDate.toISOString(),
    lastReviewDate: new Date().toISOString(),
  };
}

export function isDueForReview(cardState: CardState): boolean {
  const now = new Date();
  const reviewDate = new Date(cardState.nextReviewDate);
  return now >= reviewDate;
}

export function getTimeUntilReview(cardState: CardState): string {
  const now = new Date();
  const reviewDate = new Date(cardState.nextReviewDate);
  
  if (now >= reviewDate) {
    return "Due now";
  }

  const diffMs = reviewDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffDays > 0) {
    return `In ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  }
  if (diffHours > 0) {
    return `In ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  }
  return "In less than an hour";
}

export function formatInterval(days: number): string {
  if (days === 0) return "New";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""}`;
  }
  if (days < 365) {
    const months = Math.round(days / 30);
    return `${months} month${months > 1 ? "s" : ""}`;
  }
  const years = Math.round(days / 365);
  return `${years} year${years > 1 ? "s" : ""}`;
}
