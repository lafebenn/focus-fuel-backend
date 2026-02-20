/**
 * Time- and mood-based food suggestions for the Food Log page.
 * Snack-focused: quick bites that support focus and energy, not full meals.
 */
import type { MoodLog, FoodLog } from '@/utils/mockData';

export type SuggestionTagColor = 'primary' | 'accent' | 'warning' | 'streak';

export interface SmartSuggestionItem {
  id: string;
  name: string;
  emoji: string;
  why: string;
  benefitTag: string;
  tagColor: SuggestionTagColor;
  description: string;
}

const STRESS_THRESHOLD = 7;

const tagColorMap: Record<SuggestionTagColor, string> = {
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  warning: 'bg-warning text-warning-foreground',
  streak: 'bg-streak text-streak-foreground',
};

const STRESS_BUSTERS: SmartSuggestionItem[] = [
  { id: 'almonds', name: 'Almonds', emoji: '🥜', why: 'Magnesium helps reduce stress.', benefitTag: 'Stress relief', tagColor: 'accent', description: 'Magnesium in almonds helps calm the nervous system and supports focus under pressure.' },
  { id: 'water', name: 'Water', emoji: '💧', why: 'Hydration lowers cortisol.', benefitTag: 'Calm focus', tagColor: 'primary', description: 'Staying hydrated lowers cortisol and keeps your brain sharp without caffeine.' },
  { id: 'dark-choc-stress', name: 'Dark Chocolate', emoji: '🍫', why: 'Flavanols can improve mood.', benefitTag: 'Mood boost', tagColor: 'warning', description: 'A small square of dark chocolate has flavanols that can improve mood and reduce stress.' },
  { id: 'banana-stress', name: 'Banana', emoji: '🍌', why: 'B6 helps regulate stress.', benefitTag: 'Steady energy', tagColor: 'streak', description: 'Potassium and vitamin B6 help regulate stress and energy levels.' },
  { id: 'herbal-tea-stress', name: 'Herbal Tea', emoji: '🍵', why: 'Caffeine-free calm.', benefitTag: 'Relax', tagColor: 'accent', description: 'Chamomile or mint tea can help you unwind without affecting sleep.' },
];

const MORNING: SmartSuggestionItem[] = [
  { id: 'oatmeal', name: 'Oatmeal', emoji: '🥣', why: 'Slow-release energy.', benefitTag: 'Sustained Energy ⚡', tagColor: 'primary', description: 'Slow-release carbs give steady energy without a crash—perfect to start the day.' },
  { id: 'eggs', name: 'Eggs', emoji: '🍳', why: 'Protein + choline for focus.', benefitTag: 'Brain fuel', tagColor: 'accent', description: 'Protein and choline support focus and sustained energy.' },
  { id: 'coffee', name: 'Coffee', emoji: '☕', why: 'Alertness in moderation.', benefitTag: 'Focus ⚡', tagColor: 'warning', description: 'Caffeine in moderation can boost alertness and focus.' },
  { id: 'greek-yogurt', name: 'Greek Yogurt', emoji: '🥛', why: 'Protein keeps energy stable.', benefitTag: 'Steady Energy ⚡', tagColor: 'primary', description: 'Protein keeps you full and energy stable without a sugar spike.' },
  { id: 'banana-am', name: 'Banana', emoji: '🍌', why: 'Quick natural energy.', benefitTag: 'Quick Fuel ⚡', tagColor: 'streak', description: 'Natural sugars and potassium for a quick, clean energy boost.' },
  { id: 'nuts-am', name: 'Handful of Nuts', emoji: '🥜', why: 'Healthy fats + protein.', benefitTag: 'Sustained Energy ⚡', tagColor: 'primary', description: 'Protein and healthy fats keep you going until lunch.' },
];

const LATE_NIGHT: SmartSuggestionItem[] = [
  { id: 'herbal-tea', name: 'Herbal Tea', emoji: '🍵', why: 'Caffeine-free for sleep.', benefitTag: 'Wind down', tagColor: 'accent', description: 'Calming and caffeine-free for better sleep.' },
  { id: 'dark-chocolate', name: 'Dark Chocolate', emoji: '🍫', why: 'Satisfies without spiking sugar.', benefitTag: 'Gentle treat', tagColor: 'warning', description: 'A small amount can satisfy without spiking blood sugar.' },
  { id: 'banana-night', name: 'Banana', emoji: '🍌', why: 'Magnesium + tryptophan.', benefitTag: 'Relax', tagColor: 'streak', description: 'Magnesium and tryptophan support relaxation.' },
  { id: 'almonds-night', name: 'Almonds', emoji: '🥜', why: 'Magnesium for sleep.', benefitTag: 'Calm', tagColor: 'accent', description: 'A few almonds provide magnesium that supports restful sleep.' },
];

/** Afternoon / general snack list – focus on quick, brain-friendly snacks. */
const SNACKS_AFTERNOON: SmartSuggestionItem[] = [
  { id: 'trail-mix', name: 'Trail Mix', emoji: '🥜', why: 'Protein and healthy fats.', benefitTag: 'Quick Fuel ⚡', tagColor: 'streak', description: 'Protein and healthy fats for sustained energy.' },
  { id: 'apple', name: 'Apple', emoji: '🍎', why: 'Fiber + natural sugars.', benefitTag: 'Steady Energy ⚡', tagColor: 'primary', description: 'Fiber and natural sugars for a steady boost.' },
  { id: 'celery-hummus', name: 'Celery & Hummus', emoji: '🥒', why: 'Crunchy, hydrating, no crash.', benefitTag: 'Sustained Energy ⚡', tagColor: 'primary', description: 'A crunchy, hydrating snack that keeps you going without the crash.' },
  { id: 'dark-choc-almonds', name: 'Dark Chocolate & Almonds', emoji: '🍫', why: 'Magnesium for concentration.', benefitTag: 'Focus 🎯', tagColor: 'warning', description: 'The perfect study snack. Magnesium supports concentration.' },
  { id: 'avocado-toast', name: 'Avocado Toast', emoji: '🥑', why: 'Healthy fats + complex carbs.', benefitTag: 'Steady Energy ⚡', tagColor: 'primary', description: 'Complex carbs plus healthy fats for hours of sustained energy.' },
  { id: 'blueberry-smoothie', name: 'Blueberry Smoothie', emoji: '🫐', why: 'Antioxidants for the brain.', benefitTag: 'Brain Power 🧠', tagColor: 'accent', description: 'Blueberries are called "brain berries" for a reason!' },
  { id: 'mixed-nuts', name: 'Mixed Nuts', emoji: '🥜', why: 'Instant brain-friendly energy.', benefitTag: 'Quick Fuel ⚡', tagColor: 'streak', description: 'Grab a handful for instant, brain-friendly energy.' },
  { id: 'greek-salad-snack', name: 'Greek Salad', emoji: '🥗', why: 'Light, nutrient-dense.', benefitTag: 'No slump', tagColor: 'accent', description: 'Light and nutrient-dense without the afternoon slump.' },
];

function getCurrentHour(): number {
  return new Date().getHours();
}

function getLastMoodLog(moodLogs: MoodLog[]): MoodLog | undefined {
  if (moodLogs.length === 0) return undefined;
  const sorted = [...moodLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return sorted[0];
}

/**
 * Returns smart suggestions: time/stress-based first, then filled with more snacks.
 * Snack-focused so users see quick bites, not full meals.
 */
export function getSmartSuggestions(moodLogs: MoodLog[]): SmartSuggestionItem[] {
  const last = getLastMoodLog(moodLogs);
  if (last && last.stress > STRESS_THRESHOLD) {
    return [...STRESS_BUSTERS, ...SNACKS_AFTERNOON.filter(s => !STRESS_BUSTERS.some(b => b.id === s.id))].slice(0, 12);
  }

  const hour = getCurrentHour();
  let priority: SmartSuggestionItem[];
  if (hour >= 5 && hour < 12) priority = MORNING;
  else if (hour >= 20 || hour < 5) priority = LATE_NIGHT;
  else priority = SNACKS_AFTERNOON;

  const rest = SNACKS_AFTERNOON.filter(s => !priority.some(p => p.id === s.id));
  return [...priority, ...rest].slice(0, 12);
}

/** All snack items for lookup by name (id deduped). */
const ALL_SNACKS: SmartSuggestionItem[] = [
  ...MORNING,
  ...LATE_NIGHT,
  ...SNACKS_AFTERNOON,
  ...STRESS_BUSTERS,
].filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);

/** Keywords from recent food name -> suggestion names that pair well. */
const COMPLEMENTARY: Record<string, string[]> = {
  coffee: ['Oatmeal', 'Banana', 'Greek Yogurt'],
  oatmeal: ['Banana', 'Handful of Nuts', 'Coffee'],
  banana: ['Trail Mix', 'Water', 'Mixed Nuts'],
  eggs: ['Avocado Toast', 'Banana'],
  yogurt: ['Banana', 'Apple', 'Trail Mix'],
  nuts: ['Apple', 'Water', 'Dark Chocolate'],
  almonds: ['Apple', 'Water', 'Dark Chocolate'],
  'trail mix': ['Apple', 'Water'],
  apple: ['Mixed Nuts', 'Water', 'Almonds'],
  water: ['Banana', 'Almonds'],
  chocolate: ['Almonds', 'Banana'],
  tea: ['Banana', 'Dark Chocolate', 'Almonds'],
  salad: ['Water', 'Apple'],
  avocado: ['Eggs', 'Banana'],
};

/**
 * Returns 2 suggestions based on what the user has eaten most recently.
 * Picks complementary snacks from the last 1–3 food logs; otherwise time-based.
 */
export function getSuggestionsFromRecentEats(
  foodLogs: FoodLog[],
  moodLogs: MoodLog[]
): SmartSuggestionItem[] {
  const recent = foodLogs.slice(-3).map(l => l.food.toLowerCase());
  for (const food of recent.reverse()) {
    for (const [keyword, names] of Object.entries(COMPLEMENTARY)) {
      if (food.includes(keyword)) {
        const picked: SmartSuggestionItem[] = [];
        for (const name of names) {
          const item = ALL_SNACKS.find(s => s.name === name);
          if (item && !picked.some(p => p.id === item.id)) picked.push(item);
          if (picked.length >= 2) return picked;
        }
      }
    }
  }
  return getSmartSuggestions(moodLogs).slice(0, 2);
}

export { tagColorMap as smartSuggestionTagColorMap };
