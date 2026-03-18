import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { checkBackendHealth, foodLogAPI } from '@/api/foodLogAPI';
import { moodLogAPI } from '@/api/moodLogAPI';
import type { FoodLog, MoodLog } from '@/utils/mockData';

/**
 * Manages food + mood log data with "backend first, localStorage fallback" strategy.
 * On mount: checks backend health, loads data from DB if connected (and syncs to localStorage).
 * All mutations attempt the backend first, then update localStorage.
 */
export function useBackendData() {
  const [foodLogs, setFoodLogs] = useLocalStorage<FoodLog[]>('foodLogs', []);
  const [moodLogs, setMoodLogs] = useLocalStorage<MoodLog[]>('moodLogs', []);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const healthy = await checkBackendHealth();
      if (cancelled) return;
      setBackendConnected(healthy);

      if (healthy) {
        try {
          const [foodRes, moodRes] = await Promise.all([
            foodLogAPI.getAll(),
            moodLogAPI.getAll(),
          ]);

          if (cancelled) return;

          if (foodRes.success && Array.isArray(foodRes.data)) {
            const mapped: FoodLog[] = foodRes.data.map((row: any) => {
              const foodName = Array.isArray(row.foods) && row.foods.length > 0
                ? row.foods[0].FoodName
                : 'Food';
              return {
                id: String(row.foodlogid),
                food: foodName,
                emoji: '🍽️',
                timestamp: row.loggedat,
                category: 'snack' as const,
              };
            });
            setFoodLogs(mapped);
          }

          if (moodRes.success && Array.isArray(moodRes.data)) {
            const mapped: MoodLog[] = moodRes.data.map((row: any) => ({
              id: String(row.id),
              timestamp: row.timestamp,
              clarity: row.clarity,
              energy: row.energy,
              stress: row.stress,
              focus: row.focus,
              note: row.note,
            }));
            setMoodLogs(mapped);
          }
        } catch {
          setBackendConnected(false);
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addFoodLog = useCallback(async (name: string, emoji: string) => {
    if (backendConnected) {
      try {
        const response = await foodLogAPI.add(name, emoji);
        if (response.success) {
          const log: FoodLog = {
            id: String(response.data.foodLogId),
            food: response.data.foodName,
            emoji: response.data.emoji,
            timestamp: response.data.loggedAt,
            category: 'snack',
          };
          setFoodLogs(prev => [...prev, log]);
          return log;
        }
      } catch {
        setBackendConnected(false);
      }
    }
    const log: FoodLog = {
      id: Math.random().toString(36).substring(2, 10),
      food: name,
      emoji,
      timestamp: new Date().toISOString(),
      category: 'snack',
    };
    setFoodLogs(prev => [...prev, log]);
    return log;
  }, [backendConnected, setFoodLogs]);

  const removeFoodLog = useCallback(async (id: string) => {
    if (backendConnected) {
      try { await foodLogAPI.delete(id); } catch { /* continue with local removal */ }
    }
    setFoodLogs(prev => prev.filter(l => l.id !== id));
  }, [backendConnected, setFoodLogs]);

  const addMoodLog = useCallback(async (data: { clarity: number; energy: number; stress: number; focus: number; note?: string }) => {
    if (backendConnected) {
      try {
        const response = await moodLogAPI.add(data);
        if (response.success) {
          const log: MoodLog = {
            id: String(response.data.id),
            timestamp: response.data.timestamp,
            clarity: response.data.clarity,
            energy: response.data.energy,
            stress: response.data.stress,
            focus: response.data.focus,
            note: response.data.note,
          };
          setMoodLogs(prev => [...prev, log]);
          return log;
        }
      } catch {
        setBackendConnected(false);
      }
    }
    const log: MoodLog = {
      id: Math.random().toString(36).substring(2, 10),
      timestamp: new Date().toISOString(),
      ...data,
    };
    setMoodLogs(prev => [...prev, log]);
    return log;
  }, [backendConnected, setMoodLogs]);

  return {
    foodLogs,
    moodLogs,
    backendConnected,
    loading,
    addFoodLog,
    removeFoodLog,
    addMoodLog,
    setFoodLogs,
    setMoodLogs,
  };
}
