import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, ArrowRight, HelpCircle, Wifi, WifiOff } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { formatTime } from '@/utils/mockData';
import { getSmartSuggestions, getSuggestionsFromRecentEats, smartSuggestionTagColorMap } from '@/utils/smartSuggestions';
import type { SmartSuggestionItem } from '@/utils/smartSuggestions';
import { useNavigate } from 'react-router-dom';
import ConfettiEffect from '@/components/ConfettiEffect';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function FoodLogPage() {
  const { foodLogs, moodLogs, backendConnected, addFoodLog, removeFoodLog } = useData();
  const [search, setSearch] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAdded, setLastAdded] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const todayLogs = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return foodLogs.filter(l => l.timestamp.slice(0, 10) === today);
  }, [foodLogs]);

  const topTwoFromRecent = useMemo(
    () => getSuggestionsFromRecentEats(foodLogs, moodLogs),
    [foodLogs, moodLogs]
  );

  const smartSuggestions = useMemo(
    () => getSmartSuggestions(moodLogs),
    [moodLogs]
  );

  const filteredSuggestions = useMemo(() => {
    if (!search) return smartSuggestions;
    return smartSuggestions.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [smartSuggestions, search]);

  const handleAddFood = async (name: string, emoji: string) => {
    setIsLoading(true);
    await addFoodLog(name, emoji);
    setLastAdded(name);
    setShowSuccess(true);
    setIsLoading(false);
  };

  const addFromSearch = () => {
    if (!search.trim()) return;
    handleAddFood(search.trim(), '🍽️');
    setSearch('');
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      <ConfettiEffect show={showSuccess} />

      {backendConnected !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-3 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-display font-semibold ${
            backendConnected
              ? 'bg-primary/10 text-primary'
              : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
          }`}
        >
          {backendConnected ? (
            <>
              <Wifi size={14} />
              <span>Connected to database</span>
            </>
          ) : (
            <>
              <WifiOff size={14} />
              <span>Using local storage (backend offline)</span>
            </>
          )}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-black text-foreground">What did you eat? 🍽️</h1>
        <p className="text-muted-foreground font-display font-semibold">Every meal matters!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search for food..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search && filteredSuggestions.length === 0 && addFromSearch()}
          className="w-full bg-card rounded-2xl pl-12 pr-4 py-4 font-display font-semibold text-foreground placeholder:text-muted-foreground card-shadow border-none outline-none focus:ring-2 focus:ring-primary"
        />
      </motion.div>

      {search && filteredSuggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 bg-card rounded-xl p-4 card-shadow text-center"
        >
          <p className="text-sm font-display font-semibold text-foreground mb-2">
            "{search}" not found
          </p>
          <p className="text-xs text-muted-foreground font-display mb-3">
            Add it as a custom food
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={addFromSearch}
            className="w-full bg-primary text-primary-foreground font-display font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add "{search}"
          </motion.button>
        </motion.div>
      )}

      {topTwoFromRecent.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-4">
          <h3 className="text-xs font-display font-bold text-muted-foreground mb-2">Based on your recent eats</h3>
          <div className="grid grid-cols-2 gap-2">
            {topTwoFromRecent.map((item: SmartSuggestionItem, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                className="bg-card rounded-xl px-3 py-2.5 card-shadow flex items-center gap-2"
              >
                <span className="text-2xl shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-foreground text-xs leading-tight truncate">{item.name}</p>
                  <span className={`text-[9px] font-display font-bold px-1.5 py-0.5 rounded-full ${smartSuggestionTagColorMap[item.tagColor]}`}>
                    {item.benefitTag}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-muted-foreground hover:text-foreground p-1 rounded-full" aria-label="Why?">
                        <HelpCircle size={14} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[220px] font-display text-xs">
                      {item.why}
                    </TooltipContent>
                  </Tooltip>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleAddFood(item.name, item.emoji)}
                    disabled={isLoading}
                    className="bg-primary/10 rounded-full p-1 disabled:opacity-50"
                    aria-label={`Add ${item.name}`}
                  >
                    <Plus className="text-primary" size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {todayLogs.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-5">
          <h3 className="text-sm font-display font-bold text-muted-foreground mb-2">
            Added today ✓ {todayLogs.length} items
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {todayLogs.map(log => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-xl px-4 py-3 card-shadow flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{log.emoji}</span>
                    <div>
                      <p className="font-display font-bold text-foreground text-sm">{log.food}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(log.timestamp)}</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => removeFoodLog(log.id)}
                    className="text-muted-foreground hover:text-destructive p-1"
                  >
                    <X size={18} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mood')}
            className="mt-3 w-full bg-primary text-primary-foreground font-display font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            Next <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5">
        <h3 className="text-sm font-display font-bold text-muted-foreground mb-3">Smart Recommendations</h3>
        <div className="grid grid-cols-2 gap-2">
          {filteredSuggestions.map((item: SmartSuggestionItem, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className="bg-card rounded-xl px-3 py-3 card-shadow flex items-center gap-2 text-left"
            >
              <span className="text-2xl shrink-0">{item.emoji}</span>
              <span className="font-display font-bold text-sm text-foreground flex-1 leading-tight min-w-0">
                {item.name}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Why this suggestion?"
                    >
                      <HelpCircle size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[260px] font-display text-sm">
                    {item.why}
                  </TooltipContent>
                </Tooltip>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleAddFood(item.name, item.emoji)}
                  disabled={isLoading}
                  className="bg-primary/10 rounded-full p-1 disabled:opacity-50"
                  aria-label={`Add ${item.name}`}
                >
                  <Plus className="text-primary" size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
                ✓
              </motion.div>
              <h3 className="text-xl font-display font-black text-foreground mb-1">Nice!</h3>
              <p className="text-sm text-muted-foreground font-display">{lastAdded} logged 🎉</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
