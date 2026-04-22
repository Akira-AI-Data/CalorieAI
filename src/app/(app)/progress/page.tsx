'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Scale, Target, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { buildWeeklyCalories, TRACKER_EVENT, type WeeklyCaloriePoint } from '@/lib/nutritionTracker';

const stats = [
  { label: 'Current Weight', value: '80.3', unit: 'kg', change: '-0.5 kg', direction: 'down' as const, suffix: '', icon: Scale, color: '#3B82F6' },
  { label: 'Goal Weight', value: '75', unit: 'kg', change: '5.3 kg', direction: 'up' as const, suffix: 'to go', icon: Target, color: '#F59E0B' },
  { label: 'Day Streak', value: '12', unit: 'days', change: '', direction: 'up' as const, suffix: '', icon: Zap, color: '#A855F7' },
];

function getWeekLabel(points: WeeklyCaloriePoint[]) {
  if (!points.length) return '';
  const start = new Date(`${points[0].dateKey}T00:00:00`);
  const end = new Date(`${points[6].dateKey}T00:00:00`);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export default function ProgressPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState<WeeklyCaloriePoint[]>(buildWeeklyCalories(new Date()));

  useEffect(() => {
    const refresh = () => {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + weekOffset * 7);
      setWeeklyCalories(buildWeeklyCalories(baseDate));
    };

    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener(TRACKER_EVENT, refresh as EventListener);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(TRACKER_EVENT, refresh as EventListener);
    };
  }, [weekOffset]);

  const totalCalories = weeklyCalories.reduce((sum, point) => sum + point.cal, 0);
  const activeDays = Math.max(weeklyCalories.filter((point) => point.cal > 0).length, 1);
  const avgCalories = Math.round(totalCalories / activeDays);
  const dailyGoal = 2000;
  const maxCal = Math.max(...weeklyCalories.map((point) => point.cal), dailyGoal, 1) + 200;

  return (
    <div className="min-h-screen text-foreground px-4 py-6 pb-24 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Progress</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset((offset) => offset - 1)} className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary/5 transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-sm text-muted-foreground min-w-[110px] text-center">{getWeekLabel(weeklyCalories)}</span>
          <button onClick={() => setWeekOffset((offset) => offset + 1)} className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary/5 transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100/70">
              <Flame className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs text-muted-foreground">Avg. Calories</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{avgCalories}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">from logged meals</span>
          </div>
        </div>

        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{stat.value}</span>
              {stat.unit ? <span className="text-sm text-muted-foreground">{stat.unit}</span> : null}
            </div>
            {stat.change ? (
              <div className="flex items-center gap-1">
                {stat.direction === 'down' ? <TrendingDown className="w-3 h-3 text-primary" /> : <TrendingUp className="w-3 h-3 text-amber-400" />}
                <span className={`text-xs font-medium ${stat.label === 'Goal Weight' ? 'text-amber-400' : 'text-primary'}`}>{stat.change}</span>
                {stat.suffix ? <span className="text-xs text-muted-foreground">{stat.suffix}</span> : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weekly Calories</h2>
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-end justify-between gap-2" style={{ height: 180 }}>
            {weeklyCalories.map((point) => {
              const height = (point.cal / maxCal) * 150;
              const overGoal = point.cal > dailyGoal;
              return (
                <div key={point.dateKey} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] text-muted-foreground font-medium">{point.cal > 0 ? point.cal : ''}</span>
                  <div className="relative w-full flex justify-center" style={{ height: 150 }}>
                    <div
                      className={`w-7 rounded-t-md transition-all ${overGoal ? 'bg-red-500/80' : 'bg-primary/80'}`}
                      style={{ height, position: 'absolute', bottom: 0 }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{point.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
