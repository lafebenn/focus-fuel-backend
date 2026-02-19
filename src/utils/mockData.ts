// Mock data and types for FuelMind

export interface FoodLog {
  id: string;
  food: string;
  emoji: string;
  timestamp: string;
  category: 'breakfast' | 'snack' | 'lunch' | 'dinner';
}

export interface MoodLog {
  id: string;
  timestamp: string;
  clarity: number;
  energy: number;
  stress: number;
  focus: number;
  note?: string;
}

export interface CommonMeal {
  id: number;
  name: string;
  emoji: string;
  lastEaten: string;
  count: number;
}

export interface FoodSuggestion {
  id: number;
  name: string;
  emoji: string;
  benefits: string[];
  benefitTags: string[]; // can have multiple tags now
  tagColor: 'primary' | 'accent' | 'warning' | 'streak';
  description: string;
  allergens?: string[]; // e.g. ['Nuts', 'Dairy']
}

export interface UserSettings {
  notifications: boolean;
  reminderFrequency: 'daily' | 'custom';
  reminderTime: string;
  customReminderTimes?: string[]; // for custom schedule
  allergies: string[];
  customAllergies?: string[]; // user-added allergies
}

export interface UserStats {
  streakCurrent: number;
  streakLongest: number;
  totalFoodLogs: number;
  totalMoodLogs: number;
  lastLogDate: string;
}

export interface WeekDay {
  day: string;
  dayLetter: string;
  avgMood: number;
  foodsLogged: number;
  moodLogged: number;
  completed: boolean;
  date: string;
  annotation?: string;
  /** For day-detail sheet: what you ate that day */
  foodsThatDay?: { food: string; emoji: string }[];
  /** Latest mood log that day (clarity, energy, stress, focus) */
  moodEntry?: { clarity: number; energy: number; stress: number; focus: number };
}

export const commonMeals: CommonMeal[] = [
  { id: 1, name: 'Chicken & Rice', emoji: '🍗', lastEaten: '2026-02-10', count: 12 },
  { id: 2, name: 'Greek Salad', emoji: '🥗', lastEaten: '2026-02-09', count: 8 },
  { id: 3, name: 'Tuna Sandwich', emoji: '🥪', lastEaten: '2026-02-08', count: 6 },
  { id: 4, name: 'Oatmeal Bowl', emoji: '🥣', lastEaten: '2026-02-11', count: 15 },
  { id: 5, name: 'Greek Yogurt', emoji: '🥛', lastEaten: '2026-02-10', count: 20 },
  { id: 6, name: 'Trail Mix', emoji: '🥜', lastEaten: '2026-02-07', count: 5 },
  { id: 7, name: 'Banana', emoji: '🍌', lastEaten: '2026-02-11', count: 18 },
  { id: 8, name: 'Eggs & Toast', emoji: '🍳', lastEaten: '2026-02-10', count: 10 },
];

export const foodSuggestions: FoodSuggestion[] = [
  {
    id: 1, name: 'Celery with Hummus', emoji: '🥒',
    benefits: ['Hydrating 💧', 'Low calorie'],
    benefitTags: ['Energy'], tagColor: 'primary',
    description: 'A crunchy, hydrating snack that keeps you going without the crash.',
    allergens: ['Sesame'],
  },
  {
    id: 2, name: 'Dark Chocolate & Almonds', emoji: '🍫',
    benefits: ['Magnesium', 'Healthy fats'],
    benefitTags: ['Focus', 'Mood'], tagColor: 'warning',
    description: 'The perfect study snack. Magnesium supports concentration.',
    allergens: ['Nuts'],
  },
  {
    id: 3, name: 'Mixed Nuts', emoji: '🥜',
    benefits: ['Protein', 'Omega-3'],
    benefitTags: ['Energy', 'Focus'], tagColor: 'streak',
    description: 'Grab a handful for instant, brain-friendly energy.',
    allergens: ['Nuts'],
  },
  {
    id: 4, name: 'Avocado Toast', emoji: '🥑',
    benefits: ['Healthy fats', 'Fiber'],
    benefitTags: ['Energy'], tagColor: 'primary',
    description: 'Complex carbs plus healthy fats for hours of sustained energy.',
    allergens: ['Gluten'],
  },
  {
    id: 5, name: 'Blueberry Smoothie', emoji: '🫐',
    benefits: ['Antioxidants', 'Vitamins'],
    benefitTags: ['Mood'], tagColor: 'accent',
    description: 'Blueberries are called "brain berries" for a reason!',
  },
  {
    id: 6, name: 'Trail Mix', emoji: '🥜',
    benefits: ['Protein', 'Healthy fats'],
    benefitTags: ['Energy'], tagColor: 'primary',
    description: 'Protein and healthy fats for sustained energy between meals.',
    allergens: ['Nuts'],
  },
  {
    id: 7, name: 'Apple Slices', emoji: '🍎',
    benefits: ['Fiber', 'Natural sugars'],
    benefitTags: ['Energy'], tagColor: 'primary',
    description: 'Fiber and natural sugars for a steady boost without a crash.',
  },
  {
    id: 8, name: 'Greek Yogurt', emoji: '🥛',
    benefits: ['Protein', 'Probiotics'],
    benefitTags: ['Energy', 'Mood'], tagColor: 'primary',
    description: 'Protein keeps you full and energy stable.',
    allergens: ['Dairy'],
  },
  {
    id: 9, name: 'Banana', emoji: '🍌',
    benefits: ['Potassium', 'B6'],
    benefitTags: ['Energy'], tagColor: 'streak',
    description: 'Natural sugars and potassium for a quick, clean energy boost.',
  },
  {
    id: 10, name: 'Almonds', emoji: '🥜',
    benefits: ['Magnesium', 'Healthy fats'],
    benefitTags: ['Focus', 'Mood'], tagColor: 'warning',
    description: 'Magnesium supports concentration and helps reduce stress.',
    allergens: ['Nuts'],
  },
  {
    id: 11, name: 'Oatmeal', emoji: '🥣',
    benefits: ['Slow-release carbs', 'Fiber'],
    benefitTags: ['Energy'], tagColor: 'primary',
    description: 'Slow-release carbs give steady energy without a crash.',
    allergens: ['Gluten'],
  },
  {
    id: 12, name: 'Salmon Bowl', emoji: '🐟',
    benefits: ['Omega-3 🐟', 'Protein rich'],
    benefitTags: ['Mood', 'Focus'], tagColor: 'accent',
    description: 'Packed with omega-3 fatty acids that support memory and focus.',
    allergens: ['Fish'],
  },
  {
    id: 13, name: 'Herbal Tea', emoji: '🍵',
    benefits: ['Calming', 'Caffeine-free'],
    benefitTags: ['Focus', 'Mood'], tagColor: 'warning',
    description: 'Calming and caffeine-free—helps you wind down without affecting sleep.',
  },
  {
    id: 14, name: 'Edamame', emoji: '🫘',
    benefits: ['Protein', 'Fiber'],
    benefitTags: ['Energy', 'Focus'], tagColor: 'accent',
    description: 'A light, protein-packed snack that keeps you satisfied.',
    allergens: ['Soy'],
  },
];

export const weekData: WeekDay[] = [
  { day: 'Sun', dayLetter: 'S', avgMood: 6.5, foodsLogged: 3, moodLogged: 2, completed: true, date: '2026-02-08' },
  { day: 'Mon', dayLetter: 'M', avgMood: 5.2, foodsLogged: 4, moodLogged: 3, completed: true, date: '2026-02-09' },
  { day: 'Tue', dayLetter: 'T', avgMood: 7.1, foodsLogged: 3, moodLogged: 2, completed: true, date: '2026-02-10' },
  { day: 'Wed', dayLetter: 'W', avgMood: 6.8, foodsLogged: 2, moodLogged: 1, completed: true, date: '2026-02-11' },
  { day: 'Thu', dayLetter: 'T', avgMood: 4.5, foodsLogged: 0, moodLogged: 0, completed: false, date: '2026-02-12' },
  { day: 'Fri', dayLetter: 'F', avgMood: 7.8, foodsLogged: 0, moodLogged: 0, completed: false, date: '2026-02-13' },
  { day: 'Sat', dayLetter: 'S', avgMood: 8.2, foodsLogged: 0, moodLogged: 0, completed: false, date: '2026-02-14', annotation: 'Best day! ⭐' },
];

export const brainFacts = [
  { icon: '🧠', fact: 'Your brain uses 20% of your body\'s energy', color: 'accent' as const },
  { icon: '🐟', fact: 'Omega-3s support memory and focus', color: 'primary' as const },
  { icon: '💧', fact: 'Dehydration reduces focus by up to 20%', color: 'accent' as const },
  { icon: '🥜', fact: 'Protein helps stabilize blood sugar and energy', color: 'warning' as const },
  { icon: '🌾', fact: 'Complex carbs fuel sustained mental performance', color: 'streak' as const },
  { icon: '🫐', fact: 'Blueberries are called "brain berries" for a reason', color: 'accent' as const },
  { icon: '🍫', fact: 'Dark chocolate boosts serotonin and focus', color: 'warning' as const },
];

export const defaultSettings: UserSettings = {
  notifications: true,
  reminderFrequency: 'daily',
  reminderTime: '19:15',
  allergies: [],
};

export const defaultStats: UserStats = {
  streakCurrent: 5,
  streakLongest: 12,
  totalFoodLogs: 47,
  totalMoodLogs: 43,
  lastLogDate: '2026-02-11',
};

export const allergyOptions = [
  'Shellfish', 'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Fish', 'Sesame',
];

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning! 🌅';
  if (hour < 17) return 'Good afternoon! ☀️';
  return 'Good evening! 🌙';
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDate(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Build week data from real logs (last 7 days). Used for the dashboard chart and day-detail sheet. */
export function buildWeekDataFromLogs(
  foodLogs: FoodLog[],
  moodLogs: MoodLog[]
): WeekDay[] {
  const result: WeekDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = DAY_NAMES[d.getDay()];
    const dayLetter = dayName[0];

    const foodsOnDay = foodLogs.filter(l => l.timestamp.slice(0, 10) === dateStr);
    const moodsOnDay = moodLogs.filter(l => l.timestamp.slice(0, 10) === dateStr);
    const avgMood =
      moodsOnDay.length > 0
        ? moodsOnDay.reduce((s, m) => s + (m.clarity + m.energy + m.focus + (10 - m.stress)) / 4, 0) / moodsOnDay.length
        : 0;
    const completed = foodsOnDay.length > 0 || moodsOnDay.length > 0;
    const latestMood = moodsOnDay.length > 0
      ? moodsOnDay.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      : undefined;

    result.push({
      day: dayName,
      dayLetter,
      avgMood: Math.round(avgMood * 10) / 10,
      foodsLogged: foodsOnDay.length,
      moodLogged: moodsOnDay.length,
      completed,
      date: dateStr,
      foodsThatDay: foodsOnDay.map(l => ({ food: l.food, emoji: l.emoji })),
      moodEntry: latestMood
        ? { clarity: latestMood.clarity, energy: latestMood.energy, stress: latestMood.stress, focus: latestMood.focus }
        : undefined,
    });
  }
  return result;
}
