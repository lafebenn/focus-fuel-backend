import { useMemo } from 'react';
import type { FoodLog, MoodLog } from '@/utils/mockData';

export function useStreak(foodLogs: FoodLog[], moodLogs: MoodLog[]) {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasLogsOnDate = (date: Date) => {
      const dateStr = date.toISOString().slice(0, 10);
      const hasFood = foodLogs.some(l => l.timestamp.slice(0, 10) === dateStr);
      const hasMood = moodLogs.some(l => l.timestamp.slice(0, 10) === dateStr);
      return hasFood || hasMood;
    };

    let streak = 0;
    const d = new Date(today);
    while (hasLogsOnDate(d)) {
      streak++;
      d.setDate(d.getDate() - 1);
    }

    return {
      currentStreak: Math.max(streak, 5), // min 5 for demo
      streakActive: streak > 0,
    };
  }, [foodLogs, moodLogs]);
}
