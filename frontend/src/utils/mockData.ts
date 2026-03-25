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

/** Meal / snack slots for filtering on the Suggestions page (matches FoodLog categories). */
export type SuggestionMealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodSuggestion {
  id: number;
  name: string;
  emoji: string;
  benefits: string[];
  benefitTags: string[]; // can have multiple tags now
  /** One or more meal contexts this suggestion fits (filter chips). */
  mealTypes: SuggestionMealType[];
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

/** Suggestions: 18 each for Energy / Focus / Mood; each has `mealTypes` for breakfast, lunch, dinner, snack filters. */
export const foodSuggestions: FoodSuggestion[] = [
  // —— Energy (steady blood sugar, B vitamins, iron, complex carbs, hydration) ——
  {
    id: 1, name: 'Steel-Cut Oatmeal', emoji: '🥣',
    benefits: ['Slow carbs', 'Fiber'],
    benefitTags: ['Energy'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'primary',
    description: 'Low-GI oats release glucose gradually so energy stays even through long study blocks.',
    allergens: ['Gluten'],
  },
  {
    id: 2, name: 'Banana & Peanut Butter', emoji: '🍌',
    benefits: ['Potassium', 'Protein + carbs'],
    benefitTags: ['Energy'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'streak',
    description: 'Carbs for fuel plus protein and fat to blunt spikes—classic pre-exam fuel.',
    allergens: ['Nuts'],
  },
  {
    id: 3, name: 'Sweet Potato Bites', emoji: '🍠',
    benefits: ['Complex carbs', 'Fiber'],
    benefitTags: ['Energy'],
    mealTypes: ['lunch', 'dinner', 'snack'],
    tagColor: 'primary',
    description: 'Starch digests steadily; great when you need hours of alertness without jitters.',
  },
  {
    id: 4, name: 'Quinoa Veggie Bowl', emoji: '🥗',
    benefits: ['Complete protein', 'Minerals'],
    benefitTags: ['Energy'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'accent',
    description: 'Protein plus magnesium and iron help oxygen and energy metabolism in the brain.',
  },
  {
    id: 5, name: 'Medjool Dates', emoji: '🧆',
    benefits: ['Natural sugars', 'Potassium'],
    benefitTags: ['Energy'],
    mealTypes: ['snack'],
    tagColor: 'streak',
    description: 'Quick glucose for a slump, with fiber and minerals—pair with nuts for balance.',
  },
  {
    id: 6, name: 'Brown Rice & Black Beans', emoji: '🍚',
    benefits: ['Protein', 'Fiber'],
    benefitTags: ['Energy'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'primary',
    description: 'Rice + beans form a complete protein and steady fuel for long focus sessions.',
  },
  {
    id: 7, name: 'Apple Slices', emoji: '🍎',
    benefits: ['Fiber', 'Hydration'],
    benefitTags: ['Energy'],
    mealTypes: ['snack'],
    tagColor: 'primary',
    description: 'Fiber slows sugar absorption so you get a gentle lift instead of a crash.',
  },
  {
    id: 8, name: 'Hummus & Veggie Sticks', emoji: '🥕',
    benefits: ['Protein', 'Fiber'],
    benefitTags: ['Energy'],
    mealTypes: ['snack', 'lunch'],
    tagColor: 'accent',
    description: 'Chickpeas plus fiber keep blood sugar stable between meals.',
    allergens: ['Sesame'],
  },
  {
    id: 9, name: 'Whole-Grain Toast & Egg', emoji: '🍳',
    benefits: ['B vitamins', 'Protein'],
    benefitTags: ['Energy'],
    mealTypes: ['breakfast'],
    tagColor: 'streak',
    description: 'B vitamins and protein support energy production at the cellular level.',
    allergens: ['Gluten', 'Eggs'],
  },
  {
    id: 10, name: 'Lentil Soup', emoji: '🍲',
    benefits: ['Iron', 'Protein'],
    benefitTags: ['Energy'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'primary',
    description: 'Iron and folate support red blood cells and oxygen delivery—key when you feel drained.',
  },
  {
    id: 11, name: 'Cottage Cheese & Berries', emoji: '🫐',
    benefits: ['Protein', 'Antioxidants'],
    benefitTags: ['Energy'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'accent',
    description: 'High-protein dairy with berries gives lasting satiety and steady glucose.',
    allergens: ['Dairy'],
  },
  {
    id: 12, name: 'Roasted Chickpeas', emoji: '🫘',
    benefits: ['Protein', 'Fiber'],
    benefitTags: ['Energy'],
    mealTypes: ['snack'],
    tagColor: 'warning',
    description: 'Crunchy, portable protein and fiber to prevent afternoon energy dips.',
  },
  {
    id: 13, name: 'Orange Wedges', emoji: '🍊',
    benefits: ['Vitamin C', 'Hydration'],
    benefitTags: ['Energy'],
    mealTypes: ['snack'],
    tagColor: 'streak',
    description: 'Vitamin C helps iron absorption from other meals—great with iron-rich foods.',
  },
  {
    id: 14, name: 'Chia Pudding', emoji: '🥛',
    benefits: ['Omega-3 ALA', 'Fiber'],
    benefitTags: ['Energy'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'primary',
    description: 'Fiber and healthy fats slow digestion for hours of steady fuel.',
    allergens: ['Dairy'],
  },
  {
    id: 15, name: 'Edamame Pods', emoji: '🫛',
    benefits: ['Protein', 'Folate'],
    benefitTags: ['Energy'],
    mealTypes: ['snack'],
    tagColor: 'accent',
    description: 'Complete plant protein and B vitamins that support energy metabolism.',
    allergens: ['Soy'],
  },
  {
    id: 16, name: 'Pear & Cheese Cubes', emoji: '🍐',
    benefits: ['Fiber', 'Protein + fat'],
    benefitTags: ['Energy'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'warning',
    description: 'Fruit fiber plus dairy protein/fat keeps energy from spiking then crashing.',
    allergens: ['Dairy'],
  },
  {
    id: 17, name: 'Beet & Citrus Salad', emoji: '🥬',
    benefits: ['Nitrates', 'Vitamin C'],
    benefitTags: ['Energy'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'primary',
    description: 'Dietary nitrates can support blood flow and stamina during long mental work.',
  },
  {
    id: 18, name: 'Coconut Water', emoji: '🥥',
    benefits: ['Electrolytes', 'Hydration'],
    benefitTags: ['Energy'],
    mealTypes: ['snack'],
    tagColor: 'streak',
    description: 'Dehydration is a top cause of fatigue—electrolytes help you feel awake again.',
  },

  // —— Focus (omega-3, choline, caffeine + L-theanine, zinc, hydration, steady glucose) ——
  {
    id: 19, name: 'Walnuts', emoji: '🌰',
    benefits: ['Omega-3 ALA', 'Polyphenols'],
    benefitTags: ['Focus'],
    mealTypes: ['snack'],
    tagColor: 'warning',
    description: 'ALA and antioxidants support brain cell membranes and cognitive aging pathways.',
    allergens: ['Nuts'],
  },
  {
    id: 20, name: 'Wild Salmon', emoji: '🐟',
    benefits: ['DHA omega-3', 'Protein'],
    benefitTags: ['Focus'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'accent',
    description: 'DHA is concentrated in brain tissue and linked to attention and memory support.',
    allergens: ['Fish'],
  },
  {
    id: 21, name: 'Green Tea', emoji: '🍵',
    benefits: ['L-theanine', 'Mild caffeine'],
    benefitTags: ['Focus'],
    mealTypes: ['snack', 'breakfast'],
    tagColor: 'primary',
    description: 'L-theanine with caffeine is associated with calmer, sustained attention vs. coffee alone.',
  },
  {
    id: 22, name: 'Hard-Boiled Eggs', emoji: '🥚',
    benefits: ['Choline', 'Protein'],
    benefitTags: ['Focus'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'streak',
    description: 'Choline is a building block for acetylcholine, a neurotransmitter tied to memory.',
    allergens: ['Eggs'],
  },
  {
    id: 23, name: 'Broccoli Florets', emoji: '🥦',
    benefits: ['Choline', 'Vitamin K'],
    benefitTags: ['Focus'],
    mealTypes: ['lunch', 'dinner', 'snack'],
    tagColor: 'primary',
    description: 'Another solid choline source to support neurotransmitter synthesis.',
  },
  {
    id: 24, name: 'Pumpkin Seeds', emoji: '🎃',
    benefits: ['Zinc', 'Magnesium'],
    benefitTags: ['Focus'],
    mealTypes: ['snack'],
    tagColor: 'warning',
    description: 'Zinc and magnesium play roles in nerve signaling and stress resilience while studying.',
  },
  {
    id: 25, name: 'Blueberries', emoji: '🫐',
    benefits: ['Anthocyanins', 'Antioxidants'],
    benefitTags: ['Focus'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'accent',
    description: 'Berry polyphenols are studied for effects on memory and executive function.',
  },
  {
    id: 26, name: 'Matcha Latte (unsweet)', emoji: '🍃',
    benefits: ['L-theanine', 'Caffeine'],
    benefitTags: ['Focus'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'primary',
    description: 'Matcha delivers both caffeine and theanine for alert-but-steady concentration.',
    allergens: ['Dairy'],
  },
  {
    id: 27, name: 'Sardines on Crackers', emoji: '🐟',
    benefits: ['DHA/EPA', 'B12'],
    benefitTags: ['Focus'],
    mealTypes: ['lunch', 'snack'],
    tagColor: 'accent',
    description: 'Small oily fish pack omega-3s and B12 for nerve health and mental clarity.',
    allergens: ['Fish', 'Gluten'],
  },
  {
    id: 28, name: 'Kale Salad with Lemon', emoji: '🥬',
    benefits: ['Folate', 'Vitamin C'],
    benefitTags: ['Focus'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'primary',
    description: 'Folate supports methylation pathways the brain uses to regulate neurotransmitters.',
  },
  {
    id: 29, name: 'Dark Chocolate (70%+)', emoji: '🍫',
    benefits: ['Flavonoids', 'Magnesium'],
    benefitTags: ['Focus'],
    mealTypes: ['snack'],
    tagColor: 'warning',
    description: 'Cocoa flavonoids may boost blood flow to the brain during demanding tasks.',
  },
  {
    id: 30, name: 'Tuna Poke Bowl', emoji: '🍱',
    benefits: ['Omega-3', 'Protein'],
    benefitTags: ['Focus'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'accent',
    description: 'Lean protein plus omega-3s help sustain attention without a carb crash.',
    allergens: ['Fish', 'Soy'],
  },
  {
    id: 31, name: 'Brazil Nuts (1–2)', emoji: '🥜',
    benefits: ['Selenium'],
    benefitTags: ['Focus'],
    mealTypes: ['snack'],
    tagColor: 'streak',
    description: 'Selenium supports thyroid hormones that regulate metabolism and mental energy.',
    allergens: ['Nuts'],
  },
  {
    id: 32, name: 'Roasted Brussels Sprouts', emoji: '🥬',
    benefits: ['Choline', 'Fiber'],
    benefitTags: ['Focus'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'primary',
    description: 'Crucifers offer choline and fiber for stable glucose while you concentrate.',
  },
  {
    id: 33, name: 'Chicken & Brown Rice', emoji: '🍗',
    benefits: ['Tyrosine', 'Complex carbs'],
    benefitTags: ['Focus'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'warning',
    description: 'Protein provides tyrosine, a precursor to dopamine and norepinephrine for alertness.',
  },
  {
    id: 34, name: 'Seaweed Snack', emoji: '🌊',
    benefits: ['Iodine'],
    benefitTags: ['Focus'],
    mealTypes: ['snack'],
    tagColor: 'accent',
    description: 'Iodine is required for thyroid hormones that influence cognition and energy.',
  },
  {
    id: 35, name: 'Black Coffee (small)', emoji: '☕',
    benefits: ['Caffeine', 'Antioxidants'],
    benefitTags: ['Focus'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'streak',
    description: 'Low-to-moderate caffeine improves reaction time and vigilance for short windows.',
  },
  {
    id: 36, name: 'Water with Electrolytes', emoji: '💧',
    benefits: ['Hydration', 'Minerals'],
    benefitTags: ['Focus'],
    mealTypes: ['snack'],
    tagColor: 'primary',
    description: 'Even mild dehydration measurably worsens attention and working memory.',
  },

  // —— Mood (tryptophan, omega-3, magnesium, fermented foods, B12, stable blood sugar) ——
  {
    id: 37, name: 'Greek Yogurt & Honey', emoji: '🍯',
    benefits: ['Protein', 'Probiotics'],
    benefitTags: ['Mood'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'accent',
    description: 'Gut–brain axis: fermented dairy and protein support steady mood and satiety.',
    allergens: ['Dairy'],
  },
  {
    id: 38, name: 'Salmon & Asparagus', emoji: '🐟',
    benefits: ['Omega-3', 'B vitamins'],
    benefitTags: ['Mood'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'accent',
    description: 'EPA/DHA intake is linked in research to lower depressive symptoms in some populations.',
    allergens: ['Fish'],
  },
  {
    id: 39, name: 'Turkey Lettuce Wraps', emoji: '🦃',
    benefits: ['Tryptophan', 'Protein'],
    benefitTags: ['Mood'],
    mealTypes: ['lunch', 'dinner', 'snack'],
    tagColor: 'primary',
    description: 'Tryptophan is a building block for serotonin; pair with carbs for uptake.',
  },
  {
    id: 40, name: 'Cashews', emoji: '🥜',
    benefits: ['Magnesium', 'Zinc'],
    benefitTags: ['Mood'],
    mealTypes: ['snack'],
    tagColor: 'warning',
    description: 'Magnesium is tied to calm mood and sleep quality—both help emotional balance.',
    allergens: ['Nuts'],
  },
  {
    id: 41, name: 'Chamomile Tea', emoji: '🫖',
    benefits: ['Calming', 'Caffeine-free'],
    benefitTags: ['Mood'],
    mealTypes: ['snack'],
    tagColor: 'primary',
    description: 'Ritual + warmth reduce stress arousal before bed or after intense study.',
  },
  {
    id: 42, name: 'Sourdough & Avocado', emoji: '🥑',
    benefits: ['Fermented carbs', 'Healthy fats'],
    benefitTags: ['Mood'],
    mealTypes: ['breakfast', 'lunch'],
    tagColor: 'streak',
    description: 'Fermented bread may be easier to digest; fats support hormone production.',
    allergens: ['Gluten'],
  },
  {
    id: 43, name: 'Miso Soup', emoji: '🍲',
    benefits: ['Fermented soy', 'Warmth'],
    benefitTags: ['Mood'],
    mealTypes: ['lunch', 'dinner', 'snack'],
    tagColor: 'accent',
    description: 'Fermented foods and umami comfort can support gut diversity linked to mood.',
    allergens: ['Soy'],
  },
  {
    id: 44, name: 'Spinach & Feta Omelette', emoji: '🍳',
    benefits: ['Folate', 'Protein'],
    benefitTags: ['Mood'],
    mealTypes: ['breakfast'],
    tagColor: 'primary',
    description: 'Folate supports methylation for neurotransmitters that regulate mood.',
    allergens: ['Eggs', 'Dairy'],
  },
  {
    id: 45, name: 'Flaxseed Oatmeal', emoji: '🥣',
    benefits: ['Omega-3 ALA', 'Fiber'],
    benefitTags: ['Mood'],
    mealTypes: ['breakfast'],
    tagColor: 'warning',
    description: 'ALA and fiber support anti-inflammatory pathways and stable blood sugar.',
    allergens: ['Gluten'],
  },
  {
    id: 46, name: 'Baked Apple & Cinnamon', emoji: '🍎',
    benefits: ['Fiber', 'Comfort'],
    benefitTags: ['Mood'],
    mealTypes: ['snack', 'dinner'],
    tagColor: 'streak',
    description: 'Warm, naturally sweet food with fiber avoids sugar crashes that worsen irritability.',
  },
  {
    id: 47, name: 'Kefir Smoothie', emoji: '🥤',
    benefits: ['Probiotics', 'Protein'],
    benefitTags: ['Mood'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'accent',
    description: 'Diverse probiotics may support the gut–mood connection over time.',
    allergens: ['Dairy'],
  },
  {
    id: 48, name: 'Sunflower Seeds', emoji: '🌻',
    benefits: ['Vitamin E', 'Magnesium'],
    benefitTags: ['Mood'],
    mealTypes: ['snack'],
    tagColor: 'primary',
    description: 'Magnesium and vitamin E support oxidative balance and nervous system calm.',
  },
  {
    id: 49, name: 'Shrimp & Garlic Greens', emoji: '🦐',
    benefits: ['B12', 'Selenium'],
    benefitTags: ['Mood'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'accent',
    description: 'B12 and selenium support nerve health and thyroid function tied to mood stability.',
    allergens: ['Shellfish'],
  },
  {
    id: 50, name: 'Dark Berries Bowl', emoji: '🫐',
    benefits: ['Anthocyanins', 'Fiber'],
    benefitTags: ['Mood'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'warning',
    description: 'Berry antioxidants are associated with lower markers of inflammation linked to low mood.',
  },
  {
    id: 51, name: 'Tahini Banana Toast', emoji: '🍞',
    benefits: ['Healthy fats', 'B6'],
    benefitTags: ['Mood'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'streak',
    description: 'Sesame tahini adds minerals and fats; banana adds B6 for neurotransmitter synthesis.',
    allergens: ['Gluten', 'Sesame'],
  },
  {
    id: 52, name: 'Chicken Noodle Soup', emoji: '🍜',
    benefits: ['Warmth', 'Hydration'],
    benefitTags: ['Mood'],
    mealTypes: ['lunch', 'dinner'],
    tagColor: 'primary',
    description: 'Comfort, fluids, and gentle protein—classic support when stress runs high.',
    allergens: ['Gluten'],
  },
  {
    id: 53, name: 'Pistachios', emoji: '🥜',
    benefits: ['Protein', 'Melatonin trace'],
    benefitTags: ['Mood'],
    mealTypes: ['snack'],
    tagColor: 'warning',
    description: 'Pistachios pack protein and micronutrients; mindful shelling can also reduce stress.',
    allergens: ['Nuts'],
  },
  {
    id: 54, name: 'Cottage Cheese & Pineapple', emoji: '🍍',
    benefits: ['Tryptophan', 'Bromelain'],
    benefitTags: ['Mood'],
    mealTypes: ['breakfast', 'snack'],
    tagColor: 'accent',
    description: 'Dairy tryptophan plus fruit carbs may support serotonin pathways before rest.',
    allergens: ['Dairy'],
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
