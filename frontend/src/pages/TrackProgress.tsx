import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { calculateCorrelations } from '@/utils/calculateCorrelations';
import type { FoodLog, MoodLog } from '@/utils/mockData';
import { formatTime } from '@/utils/mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar, UtensilsCrossed, Brain } from 'lucide-react';

type ViewMode = 'charts' | 'recent' | 'stats';

export default function TrackProgressPage() {
  const [foodLogs] = useLocalStorage<FoodLog[]>('foodLogs', []);
  const [moodLogs] = useLocalStorage<MoodLog[]>('moodLogs', []);
  const [viewMode, setViewMode] = useState<ViewMode>('charts');

  // Last 30 days trend data
  const trendData = useMemo(() => {
    const data: Record<string, any> = {};
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dateStr = d.toISOString().slice(0, 10);
      const dayMoods = moodLogs.filter(l => l.timestamp.slice(0, 10) === dateStr);
      const dayFoods = foodLogs.filter(l => l.timestamp.slice(0, 10) === dateStr);
      
      if (dayMoods.length > 0) {
        const avg = dayMoods.reduce((s, m) => s + (m.clarity + m.energy + m.focus + (10 - m.stress)) / 4, 0) / dayMoods.length;
        const avgEnergy = dayMoods.reduce((s, m) => s + m.energy, 0) / dayMoods.length;
        const avgFocus = dayMoods.reduce((s, m) => s + m.focus, 0) / dayMoods.length;
        const avgClarity = dayMoods.reduce((s, m) => s + m.clarity, 0) / dayMoods.length;
        const avgStress = dayMoods.reduce((s, m) => s + m.stress, 0) / dayMoods.length;
        
        data[dateStr] = {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          avgMood: Math.round(avg * 10) / 10,
          energy: Math.round(avgEnergy * 10) / 10,
          focus: Math.round(avgFocus * 10) / 10,
          clarity: Math.round(avgClarity * 10) / 10,
          stress: Math.round(avgStress * 10) / 10,
          foodCount: dayFoods.length,
        };
      }
    }
    return Object.values(data);
  }, [foodLogs, moodLogs]);

  // Food frequency
  const foodFrequency = useMemo(() => {
    const counts: Record<string, number> = {};
    foodLogs.forEach(l => {
      counts[l.food] = (counts[l.food] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([food, count]) => ({ food, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [foodLogs]);

  // Statistics
  const stats = useMemo(() => {
    if (moodLogs.length === 0) return null;
    const avgEnergy = moodLogs.reduce((s, m) => s + m.energy, 0) / moodLogs.length;
    const avgFocus = moodLogs.reduce((s, m) => s + m.focus, 0) / moodLogs.length;
    const avgClarity = moodLogs.reduce((s, m) => s + m.clarity, 0) / moodLogs.length;
    const avgStress = moodLogs.reduce((s, m) => s + m.stress, 0) / moodLogs.length;
    const bestMood = Math.max(...moodLogs.map(m => (m.clarity + m.energy + m.focus + (10 - m.stress)) / 4));
    const worstMood = Math.min(...moodLogs.map(m => (m.clarity + m.energy + m.focus + (10 - m.stress)) / 4));
    
    return {
      avgEnergy: avgEnergy.toFixed(1),
      avgFocus: avgFocus.toFixed(1),
      avgClarity: avgClarity.toFixed(1),
      avgStress: avgStress.toFixed(1),
      bestMood: bestMood.toFixed(1),
      worstMood: worstMood.toFixed(1),
      totalLogs: moodLogs.length,
    };
  }, [moodLogs]);

  const insights = useMemo(() => calculateCorrelations(foodLogs, moodLogs), [foodLogs, moodLogs]);
  const recentFoods = useMemo(() => [...foodLogs].reverse().slice(0, 20), [foodLogs]);
  const recentMoods = useMemo(() => [...moodLogs].reverse().slice(0, 20), [moodLogs]);

  const viewTabs = [
    { id: 'charts' as const, label: 'Charts', icon: Activity },
    { id: 'recent' as const, label: 'Recent', icon: Calendar },
    { id: 'stats' as const, label: 'Stats', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-8 px-4 lg:px-10 pt-6 w-full">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-black text-foreground">Track Progress 📊</h1>
        <p className="text-muted-foreground font-display font-semibold">Dive deep into your patterns</p>
      </motion.div>

      {/* View mode tabs */}
      <div className="flex gap-2 mt-4">
        {viewTabs.map(tab => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(tab.id)}
            className={`flex-1 px-3 py-2 rounded-xl font-display font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
              viewMode === tab.id ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground card-shadow'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Charts view */}
      {viewMode === 'charts' && (
        <div className="mt-5 space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {/* 30-day trend */}
          {trendData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-4 card-shadow"
            >
              <h3 className="text-sm font-display font-bold text-foreground mb-3">30-Day Mood Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'Nunito' }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontFamily: 'Nunito',
                        fontSize: '12px',
                      }}
                    />
                    <Line type="monotone" dataKey="avgMood" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Metric breakdown */}
          {trendData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-4 card-shadow"
            >
              <h3 className="text-sm font-display font-bold text-foreground mb-3">Metric Breakdown</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'Nunito' }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontFamily: 'Nunito',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Nunito' }} />
                    <Line type="monotone" dataKey="energy" stroke="hsl(var(--streak))" strokeWidth={2} dot={false} name="Energy" />
                    <Line type="monotone" dataKey="focus" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} name="Focus" />
                    <Line type="monotone" dataKey="clarity" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Clarity" />
                    <Line type="monotone" dataKey="stress" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Stress" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Food frequency */}
          {foodFrequency.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-4 card-shadow"
            >
              <h3 className="text-sm font-display font-bold text-foreground mb-3">Most Logged Foods</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={foodFrequency} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="food" type="category" tick={{ fontSize: 10, fontFamily: 'Nunito' }} width={80} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontFamily: 'Nunito',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Correlation insights */}
          {insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-4 card-shadow"
            >
              <h3 className="text-sm font-display font-bold text-foreground mb-3">Detected Patterns</h3>
              <div className="space-y-2">
                {insights.map((ins, i) => (
                  <div key={i} className="bg-muted rounded-xl p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-display font-bold text-foreground text-sm">{ins.trigger}</span>
                      <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${
                        ins.confidence === 'High' ? 'bg-destructive/20 text-destructive' :
                        ins.confidence === 'Medium' ? 'bg-warning/20 text-warning' :
                        'bg-muted-foreground/20 text-muted-foreground'
                      }`}>
                        {ins.confidence}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-display">
                      Linked to {ins.crashCount} crash{(ins.crashCount ?? 0) !== 1 ? 'es' : ''} ({ins.percentage}% of total)
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Recent logs view */}
      {viewMode === 'recent' && (
        <div className="mt-5 space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {/* Recent food logs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-4 card-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed className="text-primary" size={18} />
              <h3 className="text-sm font-display font-bold text-foreground">Recent Food Logs</h3>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentFoods.length > 0 ? (
                recentFoods.map(f => (
                  <div key={f.id} className="bg-muted rounded-lg px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{f.emoji}</span>
                      <span className="font-display font-semibold text-foreground text-sm">{f.food}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-display">
                      {new Date(f.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {formatTime(f.timestamp)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground font-display text-center py-4">No food logs yet</p>
              )}
            </div>
          </motion.div>

          {/* Recent mood logs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-4 card-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="text-accent" size={18} />
              <h3 className="text-sm font-display font-bold text-foreground">Recent Mood Logs</h3>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentMoods.length > 0 ? (
                recentMoods.map(m => (
                  <div key={m.id} className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground font-display">
                        {new Date(m.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {formatTime(m.timestamp)}
                      </span>
                      <span className="text-xs font-display font-bold text-foreground">
                        Avg: {((m.clarity + m.energy + m.focus + (10 - m.stress)) / 4).toFixed(1)}/10
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs font-display">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Energy</span>
                        <span className="font-bold text-foreground">{m.energy}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Focus</span>
                        <span className="font-bold text-foreground">{m.focus}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clarity</span>
                        <span className="font-bold text-foreground">{m.clarity}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stress</span>
                        <span className="font-bold text-foreground">{m.stress}/10</span>
                      </div>
                    </div>
                    {m.note && (
                      <p className="text-xs text-muted-foreground font-display mt-2 italic">"{m.note}"</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground font-display text-center py-4">No mood logs yet</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Stats view */}
      {viewMode === 'stats' && (
        <div className="mt-5 space-y-4">
          {stats && (
            <>
              {/* Overview stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-5 card-shadow"
              >
                <h3 className="text-sm font-display font-bold text-foreground mb-4">Overall Averages</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-display font-black text-primary">{stats.avgEnergy}</p>
                    <p className="text-xs text-muted-foreground font-display">Energy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-display font-black text-warning">{stats.avgFocus}</p>
                    <p className="text-xs text-muted-foreground font-display">Focus</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-display font-black text-accent">{stats.avgClarity}</p>
                    <p className="text-xs text-muted-foreground font-display">Clarity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-display font-black text-destructive">{stats.avgStress}</p>
                    <p className="text-xs text-muted-foreground font-display">Stress</p>
                  </div>
                </div>
              </motion.div>

              {/* Best/worst + totals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-3"
              >
                <div className="bg-card rounded-2xl p-4 card-shadow text-center">
                  <TrendingUp className="text-streak mx-auto mb-2" size={24} />
                  <p className="text-2xl font-display font-black text-foreground">{stats.bestMood}</p>
                  <p className="text-xs text-muted-foreground font-display">Best mood</p>
                </div>
                <div className="bg-card rounded-2xl p-4 card-shadow text-center">
                  <TrendingDown className="text-muted-foreground mx-auto mb-2" size={24} />
                  <p className="text-2xl font-display font-black text-foreground">{stats.worstMood}</p>
                  <p className="text-xs text-muted-foreground font-display">Worst mood</p>
                </div>
              </motion.div>

              {/* Total logs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-5 card-shadow"
              >
                <h3 className="text-sm font-display font-bold text-foreground mb-3">Total Activity</h3>
                <div className="flex justify-around">
                  <div className="text-center">
                    <p className="text-3xl font-display font-black text-primary">{foodLogs.length}</p>
                    <p className="text-xs text-muted-foreground font-display">Food logs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-display font-black text-accent">{stats.totalLogs}</p>
                    <p className="text-xs text-muted-foreground font-display">Mood logs</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {!stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-2xl p-8 card-shadow text-center"
            >
              <Brain className="mx-auto text-muted-foreground mb-3" size={40} />
              <p className="text-muted-foreground font-display font-semibold">
                Start logging to see your stats
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
