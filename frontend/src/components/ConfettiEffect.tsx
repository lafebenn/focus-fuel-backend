import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotate: number;
  color: string;
  size: number;
}

const colors = [
  '#007BA7',            // cerulean (brand)
  'hsl(47 100% 50%)',   // yellow
  'hsl(200 92% 54%)',   // blue
  'hsl(35 100% 50%)',   // orange
  'hsl(330 80% 60%)',   // pink
];

export default function ConfettiEffect({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!show) { setPieces([]); return; }
    const newPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -(Math.random() * 20 + 10),
      rotate: Math.random() * 360,
      color: colors[i % colors.length],
      size: Math.random() * 8 + 4,
    }));
    setPieces(newPieces);
    const t = setTimeout(() => setPieces([]), 2500);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0 }}
          animate={{
            y: '110vh',
            rotate: p.rotate + 360,
            opacity: [1, 1, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 + Math.random(), ease: 'easeIn' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: p.size,
            height: p.size,
            borderRadius: p.size > 8 ? '50%' : '2px',
            backgroundColor: p.color,
            zIndex: 100,
            pointerEvents: 'none',
          }}
        />
      ))}
    </AnimatePresence>
  );
}
