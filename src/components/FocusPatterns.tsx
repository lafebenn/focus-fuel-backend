import { motion } from 'framer-motion';
import { AlertTriangle, Brain } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { calculateCorrelations } from '@/utils/calculateCorrelations';
import type { FoodLog, MoodLog } from '@/utils/mockData';

export default function FocusPatterns() {
  const [foodLogs] = useLocalStorage<FoodLog[]>('foodLogs', []);
  const [moodLogs] = useLocalStorage<MoodLog[]>('moodLogs', []);
  const insights = calculateCorrelations(foodLogs, moodLogs);
  const hasEnoughData = foodLogs.length >= 3 && moodLogs.length >= 3;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mb-5"
    >
      <h3 className="text-lg font-display font-bold text-foreground mb-3">Your Focus Patterns</h3>

      {!hasEnoughData || insights.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-2xl p-6 card-shadow text-center"
        >
          <Brain className="mx-auto text-muted-foreground mb-2" size={32} />
          <p className="text-muted-foreground font-display font-semibold">
            Keep logging to unlock your Focus Patterns.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Log food and mood for a few days to see what affects your focus and energy.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <motion.div
              key={`${insight.trigger}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="bg-card rounded-2xl p-4 card-shadow flex items-start gap-3"
            >
              <div className="rounded-full bg-warning/15 p-2 shrink-0">
                <AlertTriangle className="text-warning" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wide mb-0.5">
                  Pattern detected
                </p>
                <p className="font-display font-bold text-foreground text-sm leading-snug">
                  High <span className="text-warning">{insight.trigger}</span> leads to a crash{' '}
                  {insight.percentage ?? 0}% of the time.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Confidence: {insight.confidence}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
