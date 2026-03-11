import { createContext, useContext } from 'react';
import { useBackendData } from '@/hooks/useBackendData';
import type { FoodLog, MoodLog } from '@/utils/mockData';

interface DataContextType {
  foodLogs: FoodLog[];
  moodLogs: MoodLog[];
  backendConnected: boolean | null;
  loading: boolean;
  addFoodLog: (name: string, emoji: string) => Promise<FoodLog>;
  removeFoodLog: (id: string) => Promise<void>;
  addMoodLog: (data: { clarity: number; energy: number; stress: number; focus: number; note?: string }) => Promise<MoodLog>;
  setFoodLogs: (value: FoodLog[] | ((prev: FoodLog[]) => FoodLog[])) => void;
  setMoodLogs: (value: MoodLog[] | ((prev: MoodLog[]) => MoodLog[])) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const value = useBackendData();
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
