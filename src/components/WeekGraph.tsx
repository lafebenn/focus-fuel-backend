import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import type { WeekDay } from '@/utils/mockData';

interface WeekGraphProps {
  data: WeekDay[];
  selectedDay?: WeekDay | null;
  onDayClick?: (day: WeekDay) => void;
}

function getDayCircleClass(d: WeekDay): string {
  if (!d.completed && d.avgMood === 0) {
    return 'bg-muted text-muted-foreground';
  }
  if (d.avgMood >= 7) return 'bg-primary text-primary-foreground';
  if (d.avgMood >= 4) return 'bg-warning/90 text-warning-foreground';
  return 'bg-destructive/90 text-destructive-foreground';
}

export default function WeekGraph({ data, selectedDay, onDayClick }: WeekGraphProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl p-4 card-shadow"
    >
      <h3 className="text-lg font-display font-bold text-foreground mb-1">Your week at a glance</h3>
      <p className="text-xs text-muted-foreground font-display mb-3">Tap a day for details</p>

      {/* Day circles – color by mood, clickable */}
      <div className="flex justify-between mb-4 px-1">
        {data.map((d, i) => (
          <motion.button
            type="button"
            key={d.date}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 * i, type: 'spring', bounce: 0.5 }}
            className="flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
            onClick={() => onDayClick?.(d)}
            aria-label={`${d.day} ${d.date}, mood ${d.avgMood}`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-bold transition-colors ${getDayCircleClass(d)} ${
                selectedDay?.date === d.date ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              {d.dayLetter}
            </div>
            {d.annotation && (
              <span className="text-[10px] text-streak font-semibold">{d.annotation}</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Line chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="dayLetter" tick={{ fontSize: 12, fontFamily: 'Nunito' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} hide />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                fontFamily: 'Nunito',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}`, 'Avg Mood']}
            />
            <Line
              type="monotone"
              dataKey="avgMood"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
              activeDot={{ r: 7, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
