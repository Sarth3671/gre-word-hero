import { useState, useEffect, useCallback } from 'react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalDaysStudied: number;
}

const STREAK_STORAGE_KEY = 'vocabulary-streak-data';

const getInitialStreakData = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalDaysStudied: 0,
});

const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const useStreak = () => {
  const [streakData, setStreakData] = useState<StreakData>(getInitialStreakData());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load streak data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STREAK_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StreakData;
        
        // Check if streak is still valid
        const today = getDateString(new Date());
        if (parsed.lastStudyDate) {
          const daysDiff = getDaysDifference(parsed.lastStudyDate, today);
          
          if (daysDiff > 1) {
            // Streak broken
            parsed.currentStreak = 0;
          }
        }
        
        setStreakData(parsed);
      } catch {
        setStreakData(getInitialStreakData());
      }
    }
    setIsLoaded(true);
  }, []);

  // Save streak data to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
    }
  }, [streakData, isLoaded]);

  const recordStudySession = useCallback(() => {
    const today = getDateString(new Date());
    
    setStreakData((prev) => {
      // If already studied today, don't update
      if (prev.lastStudyDate === today) {
        return prev;
      }
      
      let newStreak = 1;
      let newTotalDays = prev.totalDaysStudied + 1;
      
      if (prev.lastStudyDate) {
        const daysDiff = getDaysDifference(prev.lastStudyDate, today);
        
        if (daysDiff === 1) {
          // Consecutive day - extend streak
          newStreak = prev.currentStreak + 1;
        } else if (daysDiff === 0) {
          // Same day
          newStreak = prev.currentStreak;
          newTotalDays = prev.totalDaysStudied;
        }
        // If daysDiff > 1, streak resets to 1 (already set above)
      }
      
      const newLongestStreak = Math.max(prev.longestStreak, newStreak);
      
      return {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastStudyDate: today,
        totalDaysStudied: newTotalDays,
      };
    });
  }, []);

  const hasStudiedToday = useCallback((): boolean => {
    const today = getDateString(new Date());
    return streakData.lastStudyDate === today;
  }, [streakData.lastStudyDate]);

  return {
    isLoaded,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    totalDaysStudied: streakData.totalDaysStudied,
    hasStudiedToday,
    recordStudySession,
  };
};
