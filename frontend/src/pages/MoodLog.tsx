import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import type { MoodLog } from '@/utils/mockData';
import { useNavigate } from 'react-router-dom';
import ConfettiEffect from '@/components/ConfettiEffect';

interface SliderConfig {
  key: keyof Pick<MoodLog, 'clarity' | 'energy' | 'stress' | 'focus'>;
  label: string;
  icon: string;
  lowLabel: string;
  highLabel: string;
  gradient: string;
}

const sliders: SliderConfig[] = [
  {
    key: 'clarity',
    label: 'Mental Clarity',
    icon: '🌫️',
    lowLabel: 'Total fog 🌫️',
    highLabel: 'Crystal clear ✨',
    gradient: 'from-muted to-accent',
  },
  {
    key: 'energy',
    label: 'Energy',
    icon: '⚡',
    lowLabel: 'Running on empty 🔋',
    highLabel: 'Fully charged ⚡',
    gradient: 'from-muted to-streak',
  },
  {
    key: 'stress',
    label: 'Stress Level',
    icon: '😌',
    lowLabel: 'Super stressed 😰',
    highLabel: 'Totally zen 😌',
    gradient: 'from-warning to-primary',
  },
  {
    key: 'focus',
    label: 'Focus & Motivation',
    icon: '🎯',
    lowLabel: "Can't concentrate 😵",
    highLabel: 'Locked in 🎯',
    gradient: 'from-destructive to-primary',
  },
];

export default function MoodLogPage() {
  const { addMoodLog } = useData();
  const [values, setValues] = useState({ clarity: 5, energy: 5, stress: 5, focus: 5 });
  const [note, setNote] = useState('');
  const [touched, setTouched] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSlider = (key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
    setTouched(true);
  };

  const submit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await addMoodLog({ ...values, note: note || undefined });
    setShowSuccess(true);
    setIsSubmitting(false);
  };

  const closeSuccessAndNavigate = () => {
    setShowSuccess(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      <ConfettiEffect show={showSuccess} />

      <AnimatePresence mode="wait">
        {!showSuccess && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-display font-black text-foreground">How are you feeling? 🧠</h1>
              <p className="text-muted-foreground font-display font-semibold">Be honest with yourself</p>
            </motion.div>

            <div className="mt-5 space-y-4">
              {sliders.map((s, i) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-card rounded-2xl p-4 card-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{s.icon}</span>
                      <span className="font-display font-bold text-foreground">{s.label}</span>
                    </div>
                    <motion.span
                      key={values[s.key]}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-display font-black text-primary"
                    >
                      {values[s.key]}
                    </motion.span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={values[s.key]}
                    onChange={e => handleSlider(s.key, parseInt(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer accent-primary bg-muted"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${values[s.key] * 10}%, hsl(var(--muted)) ${values[s.key] * 10}%, hsl(var(--muted)) 100%)`,
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-muted-foreground font-display">{s.lowLabel}</span>
                    <span className="text-[11px] text-muted-foreground font-display">{s.highLabel}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <details className="bg-card rounded-2xl card-shadow">
                <summary className="px-4 py-3 font-display font-bold text-foreground text-sm cursor-pointer">
                  Add a note? (optional) 📝
                </summary>
                <div className="px-4 pb-4">
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Anything on your mind?"
                    className="w-full bg-muted rounded-xl px-4 py-3 font-display text-sm text-foreground placeholder:text-muted-foreground border-none outline-none resize-none h-20"
                  />
                </div>
              </details>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileTap={{ scale: 0.95 }}
              onClick={submit}
              disabled={!touched || isSubmitting}
              className={`mt-5 w-full font-display font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-colors ${
                touched
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Submit ✓'}
            </motion.button>
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
                onClick={closeSuccessAndNavigate}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.6 }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-display font-black text-foreground mb-2">Awesome!</h2>
              <p className="text-muted-foreground font-display font-semibold">You logged your mood ⭐</p>
              <p className="text-sm text-muted-foreground font-display mt-1">Your patterns are getting clearer 📊</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={closeSuccessAndNavigate}
                className="mt-5 w-full bg-primary text-primary-foreground font-display font-bold py-3 rounded-xl"
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
