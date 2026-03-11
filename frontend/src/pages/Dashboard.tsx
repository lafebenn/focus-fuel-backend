import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { useStreak } from '@/hooks/useStreak';
import StreakDisplay from '@/components/StreakDisplay';
import WeekGraph from '@/components/WeekGraph';
import FocusPatterns from '@/components/FocusPatterns';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Brain, TrendingUp, X } from 'lucide-react';
import type { WeekDay } from '@/utils/mockData';
import { buildWeekDataFromLogs, brainFacts, getGreeting, formatDate, formatTime } from '@/utils/mockData';

export default function Dashboard() {
  const { foodLogs, moodLogs } = useData();
  const { currentStreak } = useStreak(foodLogs, moodLogs);
  const [factIndex] = useState(() => Math.floor(Math.random() * brainFacts.length));
  const fact = brainFacts[factIndex];

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      food: foodLogs.filter(l => l.timestamp.slice(0, 10) === today).length,
      mood: moodLogs.filter(l => l.timestamp.slice(0, 10) === today).length,
    };
  }, [foodLogs, moodLogs]);

  const weekData = useMemo(
    () => buildWeekDataFromLogs(foodLogs, moodLogs),
    [foodLogs, moodLogs]
  );

  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);

  const selectedDayLogs = useMemo(() => {
    if (!selectedDay) return { foods: [], moods: [] };
    const dateStr = selectedDay.date;
    const foods = foodLogs
      .filter(l => l.timestamp.slice(0, 10) === dateStr)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const moods = moodLogs
      .filter(l => l.timestamp.slice(0, 10) === dateStr)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return { foods, moods };
  }, [selectedDay, foodLogs, moodLogs]);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-3xl font-display font-black text-foreground">{getGreeting()}</h1>
        <p className="text-muted-foreground font-display font-semibold">{formatDate()}</p>
      </motion.div>

      <div className="flex items-center gap-3 mb-5">
        <StreakDisplay streak={currentStreak} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl px-4 py-3 card-shadow flex-1 text-center"
        >
          <p className="text-xs text-muted-foreground font-display font-semibold">Today</p>
          <p className="text-lg font-display font-black text-foreground">
            {todayCount.food + todayCount.mood}/4
          </p>
          <p className="text-[10px] text-muted-foreground font-display">logs</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Link to="/food">
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="bg-primary rounded-2xl p-5 card-shadow cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-secondary/30 -translate-y-4 translate-x-4" />
            <UtensilsCrossed className="text-primary-foreground mb-2" size={28} />
            <p className="text-primary-foreground font-display font-bold text-lg">Log Food</p>
            <p className="text-primary-foreground/70 font-display text-xs font-semibold">Quick & easy</p>
          </motion.div>
        </Link>
        <Link to="/mood">
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="bg-accent rounded-2xl p-5 card-shadow cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-accent-foreground/10 -translate-y-4 translate-x-4" />
            <Brain className="text-accent-foreground mb-2" size={28} />
            <p className="text-accent-foreground font-display font-bold text-lg">Log Mood</p>
            <p className="text-accent-foreground/70 font-display text-xs font-semibold">How do you feel?</p>
          </motion.div>
        </Link>
      </div>

      <div className="mb-5">
        <WeekGraph
          data={weekData}
          selectedDay={selectedDay}
          onDayClick={setSelectedDay}
        />
      </div>

      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-card w-full max-w-md rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-display font-black text-foreground">
                    {selectedDay.day} {new Date(selectedDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </h3>
                  <p className="text-xs text-muted-foreground font-display mt-0.5">
                    Avg mood: <span className="font-bold text-foreground">{selectedDay.avgMood.toFixed(1)}</span>/10
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-muted-foreground p-1 rounded-full hover:bg-muted"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-5">
                <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  Food logs ({selectedDayLogs.foods.length})
                </p>
                {selectedDayLogs.foods.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayLogs.foods.map(f => (
                      <div key={f.id} className="bg-muted rounded-xl px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{f.emoji}</span>
                          <span className="font-display font-semibold text-foreground text-sm">{f.food}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-display">{formatTime(f.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-display">No food logged this day.</p>
                )}
              </div>

              <div>
                <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  Mood logs ({selectedDayLogs.moods.length})
                </p>
                {selectedDayLogs.moods.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayLogs.moods.map(m => (
                      <div key={m.id} className="bg-muted rounded-xl px-3 py-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-display font-bold text-foreground text-sm">
                            {formatTime(m.timestamp)}
                          </span>
                          <span className="text-xs text-muted-foreground font-display">
                            Avg: {((m.clarity + m.energy + m.focus + (10 - m.stress)) / 4).toFixed(1)}/10
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs font-display">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Clarity</span>
                            <span className="font-bold text-foreground">{m.clarity}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Energy</span>
                            <span className="font-bold text-foreground">{m.energy}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Stress</span>
                            <span className="font-bold text-foreground">{m.stress}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Focus</span>
                            <span className="font-bold text-foreground">{m.focus}/10</span>
                          </div>
                        </div>
                        {m.note && (
                          <p className="text-xs text-muted-foreground font-display mt-2 italic">"{m.note}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-display">No mood logged this day.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FocusPatterns />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl p-5 card-shadow"
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{fact.icon}</span>
          <div className="flex-1">
            <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wide mb-1">Did you know?</p>
            <p className="text-foreground font-display font-bold">{fact.fact}</p>
          </div>
        </div>
        <Link to="/progress">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="mt-3 w-full bg-primary text-primary-foreground font-display font-bold py-3 rounded-xl text-sm"
          >
            <TrendingUp className="inline mr-1" size={16} /> Track Progress
          </motion.button>
        </Link>
      </motion.div>

      <AnimatePresence>
        {foodLogs.length === 0 && moodLogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center px-8"
            style={{ top: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-card rounded-3xl p-8 card-shadow text-center max-w-sm"
            >
              <span className="text-6xl block mb-4">🍽️❓</span>
              <h2 className="text-2xl font-display font-black text-foreground mb-2">Let's get started!</h2>
              <p className="text-muted-foreground font-display mb-5">Log your first meal to see the magic happen ✨</p>
              <Link to="/food">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary text-primary-foreground font-display font-bold py-4 rounded-2xl text-lg"
                >
                  Log Food 🍗
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
