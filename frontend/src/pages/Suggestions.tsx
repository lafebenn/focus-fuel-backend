import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookmarkPlus, Check } from 'lucide-react';
import { foodSuggestions } from '@/utils/mockData';
import type { FoodSuggestion, UserSettings, SuggestionMealType } from '@/utils/mockData';
import { defaultSettings } from '@/utils/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useData } from '@/context/DataContext';
import ConfettiEffect from '@/components/ConfettiEffect';

const benefitFilters = ['All', 'Energy ⚡', 'Focus 🎯', 'Mood 😌'] as const;

const mealFilters: { label: string; value: SuggestionMealType | 'all' }[] = [
  { label: 'All meals', value: 'all' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Snack', value: 'snack' },
];

/** One color per benefit everywhere (filters + detail modal). */
function benefitVisualClass(benefitLabel: string): string {
  const key = benefitLabel.split(' ')[0].toLowerCase();
  if (key === 'energy') return 'bg-success text-success-foreground';
  if (key === 'focus') return 'bg-primary text-primary-foreground';
  if (key === 'mood') return 'bg-warning text-warning-foreground';
  return 'bg-muted text-muted-foreground';
}

function benefitFilterButtonClass(filter: (typeof benefitFilters)[number], isActive: boolean): string {
  if (!isActive) return 'bg-card text-foreground card-shadow';
  if (filter === 'All') return 'bg-foreground text-background';
  return benefitVisualClass(filter);
}

function formatMealType(m: SuggestionMealType): string {
  return m.charAt(0).toUpperCase() + m.slice(1);
}

export default function SuggestionsPage() {
  const [activeBenefitFilter, setActiveBenefitFilter] = useState<(typeof benefitFilters)[number]>('All');
  const [activeMealFilter, setActiveMealFilter] = useState<SuggestionMealType | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<FoodSuggestion | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addFoodLog } = useData();
  const [settings] = useLocalStorage<UserSettings>('userSettings', defaultSettings);

  const filtered = useMemo(() => {
    let items = foodSuggestions;

    if (activeBenefitFilter !== 'All') {
      const filterKey = activeBenefitFilter.split(' ')[0].toLowerCase();
      items = items.filter(i => i.benefitTags.some(tag => tag.toLowerCase().includes(filterKey)));
    }

    if (activeMealFilter !== 'all') {
      items = items.filter(i => i.mealTypes.includes(activeMealFilter));
    }

    const allAllergies = [...settings.allergies, ...(settings.customAllergies || [])];
    if (allAllergies.length > 0) {
      items = items.filter(i => {
        if (!i.allergens) return true;
        return !i.allergens.some(a => allAllergies.includes(a));
      });
    }
    return items;
  }, [activeBenefitFilter, activeMealFilter, settings.allergies, settings.customAllergies]);

  const logSuggestion = async (item: FoodSuggestion) => {
    await addFoodLog(item.name, item.emoji);
    setShowSuccess(true);
    setSelectedItem(null);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      <ConfettiEffect show={showSuccess} />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-black text-foreground">Fuel your focus 🚀</h1>
        <p className="text-muted-foreground font-display font-semibold">Foods to power your study session</p>
      </motion.div>

      <div className="mt-5">
        <p className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-wide mb-2">Benefit</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {benefitFilters.map(f => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveBenefitFilter(f)}
              className={`px-4 py-2 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-colors ${benefitFilterButtonClass(f, activeBenefitFilter === f)}`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[11px] font-display font-bold text-muted-foreground uppercase tracking-wide mb-2">Meal / snack</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mealFilters.map(({ label, value }) => (
            <motion.button
              key={value}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveMealFilter(value)}
              className={`px-3.5 py-2 rounded-xl font-display font-bold text-xs whitespace-nowrap transition-colors ${
                activeMealFilter === value
                  ? 'bg-secondary text-secondary-foreground ring-1 ring-primary/30'
                  : 'bg-card text-foreground card-shadow'
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedItem(item)}
            className="bg-card rounded-xl overflow-hidden card-shadow cursor-pointer"
          >
            <div className="p-3 flex flex-col items-center text-center">
              <span className="text-4xl mb-1">{item.emoji}</span>
              <h4 className="font-display font-bold text-foreground text-xs leading-tight">{item.name}</h4>
              <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
                {item.benefitTags.map(tag => (
                  <span
                    key={tag}
                    className={`text-[9px] font-display font-bold px-2 py-0.5 rounded-full ${benefitVisualClass(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground font-display mt-6">
          No suggestions match your filters. Try different benefit or meal options.
        </p>
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-card w-full max-w-md rounded-3xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-6xl">{selectedItem.emoji}</span>
                <button onClick={() => setSelectedItem(null)} className="text-muted-foreground p-1">
                  <X size={24} />
                </button>
              </div>
              <h2 className="text-2xl font-display font-black text-foreground">{selectedItem.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedItem.benefitTags.map(tag => (
                  <span
                    key={tag}
                    className={`text-xs font-display font-bold px-3 py-1.5 rounded-full ${benefitVisualClass(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
                {selectedItem.mealTypes.map(m => (
                  <span key={m} className="text-xs font-display font-bold px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                    {formatMealType(m)}
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground font-display mt-3">{selectedItem.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedItem.benefits.map(b => (
                  <span key={b} className="bg-muted text-foreground px-3 py-1.5 rounded-full text-xs font-display font-bold">{b}</span>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => logSuggestion(selectedItem)}
                  className="flex-1 bg-primary text-primary-foreground font-display font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Log this food
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-5 bg-muted text-foreground font-display font-bold py-3.5 rounded-xl"
                >
                  <BookmarkPlus size={18} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl p-8 card-shadow text-center max-w-sm relative"
            >
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-6xl mb-3"
              >
                🎉
              </motion.div>
              <h3 className="text-xl font-display font-black text-foreground mb-1">Logged!</h3>
              <p className="text-sm text-muted-foreground font-display">Food added to your log</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
