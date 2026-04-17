'use client';

import { motion } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';
import { Check, AlertTriangle, TrendingUp, Camera, Users } from 'lucide-react';

const NUTRIENTS = [
  { name: 'Iron', score: 85, color: '#3D7A42' },
  { name: 'Calcium', score: 52, color: '#D68C45' },
  { name: 'Vitamin D', score: 38, color: '#C05A45' },
  { name: 'Protein', score: 94, color: '#1E3F20' },
  { name: 'Fiber', score: 71, color: '#3D7A42' },
  { name: 'Zinc', score: 60, color: '#D68C45' },
];

const AI_RECS = [
  { icon: AlertTriangle, text: 'Calcium intake is below target — try adding yogurt or leafy greens', type: 'warning' as const },
  { icon: Check, text: 'Great protein balance this week! Keep it up', type: 'success' as const },
  { icon: TrendingUp, text: 'Try adding more variety — 3 new cuisines this month', type: 'info' as const },
];

const TRACKING_FEATURES = [
  'Photo scanning with instant macro breakdown',
  'AI recipes tailored to your calorie goals',
  'Pantry-aware shopping lists',
];

const FAMILY_FEATURES = [
  'Age-adaptive recipes (baby to adult)',
  'Individual nutrition scoring per profile',
  'Allergy and dietary restriction filters',
];

const MACROS = [
  { name: 'Protein', pct: 75, color: '#1E3F20' },
  { name: 'Carbs', pct: 60, color: '#D68C45' },
  { name: 'Fat', pct: 45, color: '#C05A45' },
];

export function NutritionIntelligence() {
  return (
    <section className="section-spacing bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] font-bold text-[#8A9A86] mb-4">Nutrition Intelligence</p>
            <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-[1.15] font-medium text-[#1A241C]">
              Know your nutrition inside out
            </h2>
            <p className="text-base md:text-lg text-[#4A544C] leading-relaxed mt-4 max-w-2xl mx-auto">
              Go beyond calorie counting. CalorieAI scores your overall nutrition, tracks food group balance,
              highlights nutrient gaps, and gives personalized AI recommendations.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <ScrollReveal direction="left">
            <div className="space-y-4">
              {[
                'Nutrition score updates with every meal logged',
                'Food group balance bars with daily targets',
                'Per-nutrient coverage with age-priority highlighting',
                'AI-driven warnings, suggestions, and success indicators',
                '2-week meal history with cuisine diversity tracking',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3D7A42]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#3D7A42]" />
                  </div>
                  <p className="text-sm text-[#4A544C] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E0D8]">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#EAE6DF" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="#3D7A42" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={264}
                      initial={{ strokeDashoffset: 264 }}
                      whileInView={{ strokeDashoffset: 264 - (264 * 78) / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-heading text-xl font-bold text-[#1A241C]">78</span>
                </div>
                <div>
                  <p className="text-sm text-[#8A9A86]">Nutrition Score</p>
                  <p className="text-xs text-[#4A544C]">Based on last 14 days of meals</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#3D7A42] mt-1">
                    Good <TrendingUp className="w-3 h-3" /> +3 vs last week
                  </span>
                </div>
              </div>

              <h4 className="font-heading text-sm font-semibold text-[#8A9A86] uppercase tracking-wider mb-3">Nutrient Coverage</h4>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {NUTRIENTS.map((n) => (
                  <div key={n.name} className="text-center bg-[#F9F8F6] rounded-xl p-3">
                    <p className="font-heading text-lg font-bold" style={{ color: n.color }}>{n.score}</p>
                    <p className="text-xs text-[#8A9A86]">{n.name}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-heading text-sm font-semibold text-[#8A9A86] uppercase tracking-wider mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {AI_RECS.map((rec, i) => {
                  const Icon = rec.icon;
                  const colors = {
                    warning: { bg: '#D68C45', bgLight: '#D68C4515' },
                    success: { bg: '#3D7A42', bgLight: '#3D7A4215' },
                    info: { bg: '#1E3F20', bgLight: '#1E3F2015' },
                  };
                  const c = colors[rec.type];
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-xl p-3" style={{ backgroundColor: c.bgLight }}>
                      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: c.bg }} />
                      <p className="text-xs text-[#4A544C]">{rec.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollReveal delay={0}>
            <div className="bg-white rounded-3xl border border-[#E5E0D8] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-lift h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1E3F20]/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#1E3F20]" />
                </div>
                <h3 className="font-heading text-xl font-medium text-[#1A241C]">
                  Smart calorie tracking meets AI recipes
                </h3>
              </div>
              <p className="text-sm text-[#4A544C] leading-relaxed mb-5">
                Log meals by photo, barcode, or voice. Then let AI generate recipes that hit your remaining macros perfectly.
              </p>
              <ul className="space-y-2 mb-6">
                {TRACKING_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#4A544C]">
                    <Check className="w-4 h-4 text-[#3D7A42]" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                {MACROS.map((m) => (
                  <div key={m.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#4A544C]">{m.name}</span>
                      <span className="text-xs font-semibold" style={{ color: m.color }}>{m.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#EAE6DF] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="bg-white rounded-3xl border border-[#E5E0D8] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-lift h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#C05A45]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#C05A45]" />
                </div>
                <h3 className="font-heading text-xl font-medium text-[#1A241C]">
                  Personalized for every family member
                </h3>
              </div>
              <p className="text-sm text-[#4A544C] leading-relaxed mb-5">
                Create profiles for each person — from babies to adults. Recipes and nutrition scores adapt to age-specific needs.
              </p>
              <ul className="space-y-2 mb-6">
                {FAMILY_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#4A544C]">
                    <Check className="w-4 h-4 text-[#C05A45]" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3">
                {['Mom', 'Dad', 'Teen', 'Baby'].map((member, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: ['#1E3F20', '#3D7A42', '#D68C45', '#C05A45'][i] }}
                    >
                      {member[0]}
                    </div>
                    <span className="text-xs text-[#8A9A86] mt-1">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
