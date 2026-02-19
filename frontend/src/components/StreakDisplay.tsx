import { motion } from 'framer-motion';

interface StreakDisplayProps {
  streak: number;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
      className="flex items-center gap-2 bg-card rounded-2xl px-5 py-3 card-shadow"
    >
      <motion.span
        animate={{ rotate: [-5, 5, -5, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-3xl"
      >
        🔥
      </motion.span>
      <div>
        <p className="text-2xl font-display font-black text-foreground leading-none">{streak}</p>
        <p className="text-xs font-display font-semibold text-muted-foreground">day streak!</p>
      </div>
    </motion.div>
  );
}
