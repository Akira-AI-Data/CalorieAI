'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Flame, Target, Scale, Zap } from 'lucide-react';

// Compute current week dates relative to today
function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const result: { day: string; date: Date }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result.push({ day: days[i], date: d });
  }
  return result;
}

const currentWeekDates = getWeekDates();
const weekStart = currentWeekDates[0].date;
const weekEnd = currentWeekDates[6].date;
const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

const stats = [
  { label: 'Avg. Calories', value: '1,843', change: '-157', direction: 'down' as const, suffix: 'this week', icon: Flame, color: '#22C55E' },
  { label: 'Current Weight', value: '80.3', unit: 'kg', change: '-0.5 kg', direction: 'down' as const, suffix: '', icon: Scale, color: '#3B82F6' },
  { label: 'Goal Weight', value: '75', unit: 'kg', change: '5.3 kg', direction: 'up' as const, suffix: 'to go', icon: Target, color: '#F59E0B' },
  { label: 'Day Streak', value: '12', unit: 'days', change: '', direction: 'up' as const, suffix: '', icon: Zap, color: '#A855F7' },
];

const dailyGoal = 2000;
const rawWeeklyCalories = [1850, 2100, 1750, 1950, 2200, 1600, 1450];
const today = new Date();
today.setHours(0, 0, 0, 0);

const weeklyCalories = currentWeekDates.map((wd, i) => {
  const isFuture = wd.date > today;
  return { day: wd.day, cal: isFuture ? 0 : rawWeeklyCalories[i] };
});

const maxCal = Math.max(...weeklyCalories.map((d) => d.cal), dailyGoal) + 200;

const weightData = [
  { date: 'Mar 1', weight: 82.5 },
  { date: 'Mar 8', weight: 82.1 },
  { date: 'Mar 15', weight: 81.7 },
  { date: 'Mar 22', weight: 81.2 },
  { date: 'Mar 29', weight: 80.8 },
  { date: 'Apr 5', weight: 80.3 },
];

export default function ProgressPage() {
  const [weekOffset, setWeekOffset] = useState(0);

  // Weight chart calculations
  const minW = Math.min(...weightData.map((d) => d.weight)) - 1;
  const maxW = Math.max(...weightData.map((d) => d.weight)) + 1;
  const chartW = 320;
  const chartH = 160;
  const padX = 40;
  const padY = 20;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const weightPoints = weightData.map((d, i) => ({
    x: padX + (i / (weightData.length - 1)) * plotW,
    y: padY + (1 - (d.weight - minW) / (maxW - minW)) * plotH,
    ...d,
  }));

  const linePath = weightPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="min-h-screen text-foreground px-4 py-6 pb-24 max-w-4xl mx-auto space-y-6">
      {/* Header with Week Navigation */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">This Week</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="w-8 h-8 rounded-lg bg-card-bg border border-border flex items-center justify-center hover:bg-primary/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted" />
          </button>
          <span className="text-sm text-muted min-w-[110px] text-center">{weekLabel}</span>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="w-8 h-8 rounded-lg bg-card-bg border border-border flex items-center justify-center hover:bg-primary/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card-bg border border-border rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.color + '15' }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className="text-xs text-muted">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{stat.value}</span>
              {stat.unit && <span className="text-sm text-muted">{stat.unit}</span>}
            </div>
            {stat.change && (
              <div className="flex items-center gap-1">
                {stat.direction === 'down' ? (
                  <TrendingDown className="w-3 h-3 text-primary" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-amber-400" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.label === 'Goal Weight' ? 'text-amber-400' : 'text-primary'
                  }`}
                >
                  {stat.change}
                </span>
                {stat.suffix && <span className="text-xs text-muted">{stat.suffix}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Weekly Calories Bar Chart */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Weekly Calories</h2>
        <div className="bg-card-bg rounded-2xl border border-border p-4">
          <div className="flex items-end justify-between gap-2" style={{ height: 180 }}>
            {weeklyCalories.map((d) => {
              const height = (d.cal / maxCal) * 150;
              const overGoal = d.cal > dailyGoal;
              return (
                <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] text-muted font-medium">{d.cal > 0 ? d.cal : ''}</span>
                  <div className="relative w-full flex justify-center" style={{ height: 150 }}>
                    <div
                      className={`w-7 rounded-t-md transition-all ${
                        overGoal ? 'bg-red-500/80' : 'bg-primary/80'
                      }`}
                      style={{ height, position: 'absolute', bottom: 0 }}
                    />
                  </div>
                  <span className="text-xs text-muted">{d.day}</span>
                </div>
              );
            })}
          </div>
          {/* Goal line */}
          <div className="relative mt-2">
            <div
              className="absolute w-full border-t-2 border-dashed border-muted-foreground"
              style={{ bottom: `${(dailyGoal / maxCal) * 150 + 30}px` }}
            />
          </div>
          {/* Goal line label */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <div className="w-4 border-t-2 border-dashed border-muted" />
            <span className="text-[10px] text-muted">Daily goal ({dailyGoal} cal)</span>
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-primary/80" />
                <span className="text-[10px] text-muted">Under</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-red-500/80" />
                <span className="text-[10px] text-muted">Over</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weight Trend Line Chart */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Weight Trend</h2>
        <div className="bg-card-bg rounded-2xl border border-border p-4">
          <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            {/* Horizontal grid lines */}
            {[minW, minW + (maxW - minW) / 2, maxW].map((v, i) => {
              const y = padY + (1 - (v - minW) / (maxW - minW)) * plotH;
              return (
                <g key={i}>
                  <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="#E7E5E4" strokeWidth={1} />
                  <text x={padX - 6} y={y + 3} textAnchor="end" fill="#78716C" fontSize={9}>
                    {v.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Gradient fill under line */}
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path
              d={`${linePath} L${weightPoints[weightPoints.length - 1].x},${padY + plotH} L${weightPoints[0].x},${padY + plotH} Z`}
              fill="url(#weightGradient)"
            />

            {/* Line */}
            <path d={linePath} fill="none" stroke="#22C55E" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* Data points and labels */}
            {weightPoints.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={4} fill="#22C55E" />
                <circle cx={p.x} cy={p.y} r={2} fill="#1C1917" />
                <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#A8A29E" fontSize={9} fontWeight={600}>
                  {p.weight}
                </text>
                <text x={p.x} y={chartH + 14} textAnchor="middle" fill="#78716C" fontSize={8}>
                  {p.date}
                </text>
              </g>
            ))}
          </svg>

          {/* Summary */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">-2.2 kg</span>
              <span className="text-xs text-muted">total lost</span>
            </div>
            <span className="text-xs text-muted">
              {weightData[0].date} - {weightData[weightData.length - 1].date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
