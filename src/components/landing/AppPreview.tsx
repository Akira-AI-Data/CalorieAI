'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ScrollReveal } from '../animations/ScrollReveal';

export function AppPreview() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Your nutrition dashboard
            </h2>
            <p className="text-muted mt-4 text-lg">
              Everything at a glance. Beautiful, intuitive, and designed for your goals.
            </p>
          </div>
        </ScrollReveal>

        <motion.div style={{ y, scale }} className="relative max-w-4xl mx-auto">
          {/* Mock dashboard */}
          <div className="rounded-3xl border border-border bg-gradient-to-br from-brand-bg-soft to-white p-8 shadow-2xl shadow-brand-green/10">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-foreground">Today&apos;s Summary</h3>
                <p className="text-sm text-muted">April 10, 2026</p>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Calorie ring */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-border">
                <svg className="w-32 h-32" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" stroke="#E7E5E4" strokeWidth="8" fill="none" />
                  <circle
                    cx="60" cy="60" r="50"
                    stroke="#22C55E" strokeWidth="8" fill="none"
                    strokeDasharray="314" strokeDashoffset="78"
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <text x="60" y="55" textAnchor="middle" className="text-2xl font-bold fill-foreground" fontSize="22">1,648</text>
                  <text x="60" y="72" textAnchor="middle" className="fill-muted" fontSize="10">of 2,100 cal</text>
                </svg>
                <p className="text-sm font-medium text-foreground mt-2">Calories</p>
              </div>

              {/* Macros */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-border">
                <h4 className="text-sm font-semibold text-foreground">Macros</h4>
                {[
                  { label: 'Protein', value: '98g', target: '130g', pct: 75, color: '#22C55E' },
                  { label: 'Carbs', value: '182g', target: '250g', pct: 73, color: '#F59E0B' },
                  { label: 'Fat', value: '52g', target: '70g', pct: 74, color: '#3B82F6' },
                ].map((macro) => (
                  <div key={macro.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground font-medium">{macro.label}</span>
                      <span className="text-muted">{macro.value} / {macro.target}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${macro.pct}%`, backgroundColor: macro.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent meals */}
              <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white border border-border">
                <h4 className="text-sm font-semibold text-foreground">Recent Meals</h4>
                {[
                  { name: 'Avocado Toast', cal: 320, time: '8:30 AM' },
                  { name: 'Grilled Chicken Salad', cal: 480, time: '12:45 PM' },
                  { name: 'Greek Yogurt + Berries', cal: 210, time: '3:15 PM' },
                ].map((meal, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{meal.name}</p>
                      <p className="text-xs text-muted">{meal.time}</p>
                    </div>
                    <span className="text-sm font-medium text-brand-green">{meal.cal} cal</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
