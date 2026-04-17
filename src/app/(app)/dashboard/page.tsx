'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FluentEmoji } from '@/components/ui/FluentEmoji';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Flame, UtensilsCrossed, BookOpen, CalendarDays, ShoppingCart,
  Clock, AlertTriangle, Sparkles, TrendingUp, TrendingDown,
  Heart, ChevronLeft, ChevronRight, Target, Scale, Zap,
  Droplets, Apple, Beef, Wheat,
} from 'lucide-react';

/* ── Data ─────────────────────────────────────────── */
const consumed = 1450;
const goal = 2000;
const remaining = goal - consumed;
const calorieProgress = (consumed / goal) * 100;

const macros = [
  { label: 'Protein', current: 105, target: 150, unit: 'g', color: '#22C55E', icon: Beef, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600' },
  { label: 'Carbs',   current: 155, target: 250, unit: 'g', color: '#3B82F6', icon: Wheat, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600' },
  { label: 'Fat',     current: 45,  target: 65,  unit: 'g', color: '#F59E0B', icon: Flame, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600' },
  { label: 'Water',   current: 1500, target: 2500, unit: 'ml', color: '#06B6D4', icon: Droplets, bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600' },
];

const recentMeals = [
  { name: 'Oatmeal with berries', type: 'Breakfast', time: '8:30 AM', cal: 320, icon: Apple },
  { name: 'Greek yogurt', type: 'Snack', time: '10:00 AM', cal: 150, icon: Apple },
  { name: 'Grilled chicken salad', type: 'Lunch', time: '12:30 PM', cal: 480, icon: UtensilsCrossed },
  { name: 'Apple & peanut butter', type: 'Snack', time: '3:00 PM', cal: 250, icon: Apple },
  { name: 'Protein smoothie', type: 'Snack', time: '5:15 PM', cal: 250, icon: Droplets },
];

const mealTypeBadge: Record<string, string> = {
  Breakfast: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Lunch:     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Dinner:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Snack:     'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

const quickActions = [
  { label: 'AI Cookbook', href: '/cookbook', icon: BookOpen, desc: 'AI-powered recipes', color: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600' },
  { label: 'Meal Plan',   href: '/meal-plan', icon: CalendarDays, desc: 'Weekly planning', color: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600' },
  { label: 'Shopping',    href: '/shopping', icon: ShoppingCart, desc: 'Smart grocery list', color: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600' },
];

/* ── Progress / Weekly ─────────────────────────────── */
function getWeekDates() {
  const today = new Date();
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { day, date: d };
  });
}
const currentWeekDates = getWeekDates();
const weekLabel = `${currentWeekDates[0].date.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${currentWeekDates[6].date.toLocaleDateString('en-US',{month:'short',day:'numeric'})}`;
const _today = new Date(); _today.setHours(0,0,0,0);
const rawWeekly = [1850,2100,1750,1950,2200,1600,1450];
const weeklyCalories = currentWeekDates.map((w,i)=>({ day:w.day, cal: w.date > _today ? 0 : rawWeekly[i] }));
const maxCal = Math.max(...weeklyCalories.map(d=>d.cal), 2000) + 200;
const dailyGoal = 2000;

const progressStats = [
  { label:'Avg. Calories', value:'1,843', change:'-157', dir:'down', suffix:'this week', icon:Flame, color:'#22C55E' },
  { label:'Current Weight', value:'80.3', unit:'kg', change:'-0.5 kg', dir:'down', suffix:'', icon:Scale, color:'#3B82F6' },
  { label:'Goal Weight', value:'75', unit:'kg', change:'5.3 kg', dir:'up', suffix:'to go', icon:Target, color:'#F59E0B' },
  { label:'Day Streak', value:'12', unit:'days', change:'', dir:'up', suffix:'', icon:Zap, color:'#A855F7' },
];

const weightData = [
  { date:'Mar 1', weight:82.5 },{ date:'Mar 8', weight:82.1 },{ date:'Mar 15', weight:81.7 },
  { date:'Mar 22', weight:81.2 },{ date:'Mar 29', weight:80.8 },{ date:'Apr 5', weight:80.3 },
];

/* ── Nutrition ─────────────────────────────────────── */
const nutritionScore = 72;
const foodGroups = [
  { label:'Vegetables', emoji:'🫑', types:4, pct:65, color:'#22C55E' },
  { label:'Fruits',     emoji:'🍎', types:2, pct:40, color:'#F59E0B' },
  { label:'Grains',     emoji:'🌾', types:3, pct:55, color:'#8B5CF6' },
  { label:'Protein',    emoji:'🍗', types:5, pct:80, color:'#EF4444' },
  { label:'Dairy',      emoji:'🥛', types:1, pct:25, color:'#3B82F6' },
];
const nutrients = [
  { label:'Vitamin A', pct:45, priority:true },{ label:'Vitamin C', pct:70, priority:false },
  { label:'Iron',      pct:30, priority:true },{ label:'Calcium',  pct:55, priority:false },
  { label:'Protein',   pct:80, priority:false },{ label:'Healthy Fats', pct:60, priority:false },
  { label:'Fiber',     pct:50, priority:false },{ label:'Zinc',    pct:35, priority:true },
  { label:'B Vitamins',pct:65, priority:false },{ label:'Potassium',pct:40, priority:false },
  { label:'Omega-3',   pct:25, priority:false },{ label:'Folate',  pct:55, priority:false },
];
const recommendations = [
  { type:'warning', title:'Low iron intake', desc:'Add lentils, spinach, red meat, or chicken to boost iron levels.' },
  { type:'warning', title:'Low dairy consumption', desc:'Add yogurt, cheese, or milk to improve calcium and vitamin D.' },
  { type:'success', title:'Great protein balance', desc:'Your protein intake is on track this week. Keep it up!' },
  { type:'suggestion', title:'Try more variety', desc:'Add 2–3 new fruits this week to improve vitamin coverage.' },
];

/* ── Sub-components ────────────────────────────────── */
function CalorieRing({ size, sw, pct }: { size: number; sw: number; pct: number }) {
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - Math.min(pct / 100, 1) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={sw} className="text-border" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#22C55E" strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-700 ease-out drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
    </svg>
  );
}

function NutritionScoreRing({ score }: { score: number }) {
  const size = 130, sw = 10, r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative flex-shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={sw} className="text-border" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{score}</span>
        <span className="text-[10px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function getNutrientStyle(pct: number) {
  if (pct >= 70) return { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', bar: 'bg-emerald-500' };
  if (pct >= 40) return { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', bar: 'bg-amber-500' };
  return { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', bar: 'bg-red-500' };
}

/* ── Page ─────────────────────────────────────────── */
export default function DashboardPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const { data: session } = useSession();
  const [profileName, setProfileName] = useState<string>('');
  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => {
        if (d.profile?.full_name) setProfileName(d.profile.full_name);
      })
      .catch(() => { /* keep fallback */ });
  }, []);
  const firstName =
    profileName.split(' ')[0] ||
    session?.user?.name?.split(' ')[0] ||
    session?.user?.email?.split('@')[0] ||
    '';
  const hr = new Date().getHours();
  const greeting = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';

  const minW = Math.min(...weightData.map(d=>d.weight)) - 1;
  const maxW = Math.max(...weightData.map(d=>d.weight)) + 1;
  const cW=320, cH=140, pX=40, pY=16, pW=cW-pX*2, pH=cH-pY*2;
  const wPts = weightData.map((d,i)=>({
    x: pX + (i/(weightData.length-1))*pW,
    y: pY + (1-(d.weight-minW)/(maxW-minW))*pH,
    ...d,
  }));
  const linePath = wPts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="min-h-screen text-foreground pb-24 space-y-6 animate-in fade-in duration-300">

      {/* ── Hero Calorie Card ─────────────────────── */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-emerald-50 dark:from-primary/20 dark:via-background dark:to-emerald-900/10 border-primary/20 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <CalorieRing size={130} sw={10} pct={calorieProgress} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Flame className="w-5 h-5 text-primary mb-0.5" />
                <span className="text-2xl font-bold tabular-nums">{consumed}</span>
                <span className="text-[10px] text-muted-foreground">of {goal}</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1 className="text-2xl font-bold">{greeting}{firstName ? `, ${firstName}` : ''}! 👋</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-semibold text-primary">{consumed} cal</span> consumed ·{' '}
                  <span className="font-semibold text-foreground">{remaining} cal</span> remaining
                </p>
              </div>
              <Progress value={calorieProgress} className="h-2" />
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Link href="/log" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 active:scale-95">
                  <UtensilsCrossed className="w-4 h-4" /> Log a Meal
                </Link>
                <Link href="/cookbook" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background font-semibold text-sm hover:bg-muted/50 transition-all active:scale-95">
                  <BookOpen className="w-4 h-4" /> AI Cookbook
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Main Tabs ────────────────────────────── */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-sm">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        {/* ── TODAY TAB ─────────────────────── */}
        <TabsContent value="today" className="space-y-4 animate-in fade-in duration-200">
          {/* Macros */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Today&apos;s Macros</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {macros.map((m) => (
                <div key={m.label} className={`${m.bg} rounded-2xl p-4 space-y-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <m.icon className={`w-4 h-4 ${m.text}`} />
                      <span className="text-xs font-semibold text-foreground">{m.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 font-mono tabular-nums">
                      {m.current}{m.unit}
                    </Badge>
                  </div>
                  <Progress value={(m.current/m.target)*100} className="h-1.5" style={{ '--progress-color': m.color } as React.CSSProperties} />
                  <p className="text-[10px] text-muted-foreground">{m.current} / {m.target}{m.unit}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Meals */}
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Meals</CardTitle>
              <Link href="/log" className="text-xs text-primary hover:underline font-medium">View all →</Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentMeals.map((meal, i) => (
                <div key={meal.name} className={`flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors ${i < recentMeals.length-1 ? 'border-b border-border' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <meal.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-tight">{meal.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge className={`text-[10px] px-1.5 py-0 h-4 ${mealTypeBadge[meal.type] || ''}`}>{meal.type}</Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{meal.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary tabular-nums">{meal.cal} cal</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((a) => (
              <Link key={a.label} href={a.href} className="group">
                <Card className="h-full hover:border-primary/40 hover:shadow-md transition-all duration-200 active:scale-[0.98]">
                  <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                    <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <a.icon className={`w-5 h-5 ${a.text}`} />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{a.label}</span>
                    <span className="text-[10px] text-muted-foreground">{a.desc}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* ── PROGRESS TAB ──────────────────── */}
        <TabsContent value="progress" className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">{weekLabel}</Badge>
            <div className="flex gap-1">
              <button onClick={()=>setWeekOffset(o=>o-1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted/50 transition-colors active:scale-95">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={()=>setWeekOffset(o=>o+1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted/50 transition-colors active:scale-95">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {progressStats.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor:`${s.color}18`}}>
                      <s.icon className="w-4 h-4" style={{color:s.color}} />
                    </div>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold tabular-nums">{s.value}</span>
                    {s.unit && <span className="text-sm text-muted-foreground">{s.unit}</span>}
                  </div>
                  {s.change && (
                    <div className="flex items-center gap-1">
                      {s.dir==='down' ? <TrendingDown className="w-3 h-3 text-primary"/> : <TrendingUp className="w-3 h-3 text-amber-400"/>}
                      <span className={`text-xs font-medium ${s.label==='Goal Weight'?'text-amber-500':'text-primary'}`}>{s.change}</span>
                      {s.suffix && <span className="text-xs text-muted-foreground">{s.suffix}</span>}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weekly Calorie Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weekly Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2" style={{height:160}}>
                {weeklyCalories.map((d)=>{
                  const h=(d.cal/maxCal)*130;
                  const over=d.cal>dailyGoal;
                  return (
                    <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-[9px] text-muted-foreground font-medium tabular-nums">{d.cal>0?d.cal:''}</span>
                      <div className="relative w-full flex justify-center" style={{height:130}}>
                        <div className={`w-6 rounded-t-lg transition-all duration-500 ${over?'bg-red-400/80':'bg-primary/75'}`} style={{height:h||2,position:'absolute',bottom:0}} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{d.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-primary/75"/>Under goal</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-400/80"/>Over goal</div>
              </div>
            </CardContent>
          </Card>

          {/* Weight Trend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weight Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox={`0 0 ${cW} ${cH+20}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                {[minW, minW+(maxW-minW)/2, maxW].map((v,i)=>{
                  const y=pY+(1-(v-minW)/(maxW-minW))*pH;
                  return <g key={i}><line x1={pX} y1={y} x2={cW-pX} y2={y} stroke="#E5E7EB" strokeWidth={1}/><text x={pX-5} y={y+3} textAnchor="end" fill="#9CA3AF" fontSize={8}>{v.toFixed(1)}</text></g>;
                })}
                <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22C55E" stopOpacity={0.25}/><stop offset="100%" stopColor="#22C55E" stopOpacity={0}/></linearGradient></defs>
                <path d={`${linePath} L${wPts[wPts.length-1].x},${pY+pH} L${wPts[0].x},${pY+pH} Z`} fill="url(#wg)"/>
                <path d={linePath} fill="none" stroke="#22C55E" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                {wPts.map((p,i)=>(
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={4} fill="#22C55E"/>
                    <circle cx={p.x} cy={p.y} r={2} fill="white"/>
                    <text x={p.x} y={p.y-9} textAnchor="middle" fill="#6B7280" fontSize={8} fontWeight={600}>{p.weight}</text>
                    <text x={p.x} y={cH+14} textAnchor="middle" fill="#9CA3AF" fontSize={7}>{p.date}</text>
                  </g>
                ))}
              </svg>
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5"><TrendingDown className="w-4 h-4 text-primary"/><span className="text-sm font-semibold text-primary">-2.2 kg</span><span className="text-xs text-muted-foreground">total lost</span></div>
                <span className="text-xs text-muted-foreground">{weightData[0].date} – {weightData[weightData.length-1].date}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── NUTRITION TAB ─────────────────── */}
        <TabsContent value="nutrition" className="space-y-4 animate-in fade-in duration-200">
          {/* Score + Food Groups */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Nutrition Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <NutritionScoreRing score={nutritionScore} />
                  <p className="text-sm font-semibold text-foreground">Nutrition Score</p>
                  <p className="text-xs text-muted-foreground">Based on recent meals</p>
                </div>
                <div className="flex-1 w-full space-y-3">
                  <p className="text-sm font-semibold text-foreground">Food Group Balance</p>
                  {foodGroups.map((g)=>(
                    <div key={g.label}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-foreground"><FluentEmoji emoji={g.emoji} size={16} />{g.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{g.types} {g.types===1?'type':'types'}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 font-mono">{g.pct}%</Badge>
                        </div>
                      </div>
                      <Progress value={g.pct} className="h-2" style={{'--progress-color':g.color} as React.CSSProperties}/>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutrient Coverage */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400"/>Nutrient Coverage
              </CardTitle>
              <p className="text-xs text-muted-foreground">Priority nutrients highlighted with ★</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {nutrients.map((n)=>{
                  const s=getNutrientStyle(n.pct);
                  return (
                    <div key={n.label} className={`${s.badge.split(' ').slice(0,2).join(' ')} rounded-xl p-3 ${n.priority?'ring-1 ring-current ring-offset-0':''}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[10px] font-medium truncate">{n.label}</span>
                        {n.priority && <span className="text-[9px] text-red-500">★</span>}
                      </div>
                      <p className="text-xl font-bold">{n.pct}<span className="text-xs font-normal">%</span></p>
                      <div className="h-1 rounded-full bg-white/50 mt-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${s.bar}`} style={{width:`${n.pct}%`}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations via Accordion */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary"/>Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Accordion type="multiple" className="space-y-2">
                {recommendations.map((r,i)=>(
                  <AccordionItem key={i} value={`rec-${i}`} className={`rounded-xl border px-4 ${r.type==='warning'?'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10':r.type==='success'?'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10':'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10'}`}>
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${r.type==='warning'?'bg-amber-100 dark:bg-amber-900/30':r.type==='success'?'bg-emerald-100 dark:bg-emerald-900/30':'bg-blue-100 dark:bg-blue-900/30'}`}>
                          {r.type==='warning'?<AlertTriangle className="w-3.5 h-3.5 text-amber-600"/>:r.type==='success'?<TrendingUp className="w-3.5 h-3.5 text-emerald-600"/>:<Sparkles className="w-3.5 h-3.5 text-blue-600"/>}
                        </div>
                        <span className={`text-sm font-semibold ${r.type==='warning'?'text-amber-800 dark:text-amber-300':r.type==='success'?'text-emerald-800 dark:text-emerald-300':'text-blue-800 dark:text-blue-300'}`}>{r.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className={`text-xs pb-2 ${r.type==='warning'?'text-amber-700 dark:text-amber-400':r.type==='success'?'text-emerald-700 dark:text-emerald-400':'text-blue-700 dark:text-blue-400'}`}>{r.desc}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
