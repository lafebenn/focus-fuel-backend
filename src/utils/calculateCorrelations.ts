/**
 * Correlation engine: links Food Logs in a 3-hour window before Mental (Mood) crashes
 * to identify recurring triggers (e.g. "Sugar" before crashes).
 */
import type { FoodLog, MoodLog } from '@/utils/mockData';

export type InsightImpact = 'Crash' | 'Boost';
export type InsightConfidence = 'High' | 'Medium' | 'Low';

export interface Insight {
  trigger: string;
  impact: InsightImpact;
  confidence: InsightConfidence;
  /** e.g. 80 for "80% of the time" */
  percentage?: number;
  /** Number of crashes this trigger was associated with */
  crashCount?: number;
}

const CRASH_THRESHOLD = 4;
const WINDOW_MS = 3 * 60 * 60 * 1000; // 3 hours
const MIN_CRASHES_FOR_INSIGHT = 2;

/** Keywords (lowercase) that map to a display tag for correlation. */
const FOOD_TAG_KEYWORDS: Record<string, string[]> = {
  Sugar: ['sugar', 'candy', 'soda', 'donut', 'cake', 'cookie', 'pastry', 'sweet', 'ice cream', 'chocolate bar', 'energy drink', 'juice'],
  Caffeine: ['coffee', 'caffeine', 'espresso', 'latte', 'energy drink', 'red bull', 'tea'],
  'Heavy meal': ['burger', 'pizza', 'fried', 'fast food', 'heavy', 'greasy'],
  Dairy: ['milk', 'cheese', 'yogurt', 'dairy', 'ice cream'],
  Processed: ['chips', 'crackers', 'processed', 'white bread', 'bagel'],
};

function getTagsFromFood(foodName: string): string[] {
  const lower = foodName.toLowerCase();
  const tags: string[] = [];
  for (const [tag, keywords] of Object.entries(FOOD_TAG_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) tags.push(tag);
  }
  return tags;
}

/** Mental Log entries where Focus or Energy dropped below threshold ("crash"). */
function findCrashes(moodLogs: MoodLog[]): MoodLog[] {
  return moodLogs.filter(
    log => log.focus < CRASH_THRESHOLD || log.energy < CRASH_THRESHOLD
  );
}

/** Food logs whose timestamp is within [crashTime - 3h, crashTime]. */
function getFoodsBeforeCrash(crashTime: string, foodLogs: FoodLog[]): FoodLog[] {
  const crashMs = new Date(crashTime).getTime();
  const windowStart = crashMs - WINDOW_MS;
  return foodLogs.filter(log => {
    const logMs = new Date(log.timestamp).getTime();
    return logMs >= windowStart && logMs <= crashMs;
  });
}

function getConfidence(crashCount: number, totalCrashes: number, percentage: number): InsightConfidence {
  if (crashCount >= 3 && percentage >= 70) return 'High';
  if (crashCount >= 2 && percentage >= 50) return 'Medium';
  return 'Low';
}

/**
 * Correlates food entries with subsequent mood crashes (Focus or Energy < 4).
 * Returns insight objects for recurring triggers.
 */
export function calculateCorrelations(
  foodLogs: FoodLog[],
  moodLogs: MoodLog[]
): Insight[] {
  const crashes = findCrashes(moodLogs);
  if (crashes.length < MIN_CRASHES_FOR_INSIGHT) return [];

  const tagToCrashes = new Map<string, Set<string>>(); // tag -> set of crash log ids

  for (const crash of crashes) {
    const foodsBefore = getFoodsBeforeCrash(crash.timestamp, foodLogs);
    const tagsInWindow = new Set<string>();
    for (const f of foodsBefore) {
      for (const tag of getTagsFromFood(f.food)) tagsInWindow.add(tag);
    }
    for (const tag of tagsInWindow) {
      if (!tagToCrashes.has(tag)) tagToCrashes.set(tag, new Set());
      tagToCrashes.get(tag)!.add(crash.id);
    }
  }

  const insights: Insight[] = [];
  const totalCrashes = crashes.length;

  for (const [trigger, crashIds] of tagToCrashes) {
    const crashCount = crashIds.size;
    if (crashCount < 2) continue;
    const percentage = Math.round((crashCount / totalCrashes) * 100);
    const confidence = getConfidence(crashCount, totalCrashes, percentage);
    insights.push({
      trigger,
      impact: 'Crash',
      confidence,
      percentage,
      crashCount,
    });
  }

  // Sort by crash count desc, then percentage desc
  insights.sort((a, b) => (b.crashCount ?? 0) - (a.crashCount ?? 0) || (b.percentage ?? 0) - (a.percentage ?? 0));
  return insights;
}
