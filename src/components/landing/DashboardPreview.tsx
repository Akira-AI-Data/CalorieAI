'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';

const MEAL_PLAN = [
  { emoji: '🌅', meal: 'Berry Overnight Oats', type: 'Breakfast', cal: 350 },
  { emoji: '☀️', meal: 'Thai Green Curry', type: 'Lunch', cal: 520 },
  { emoji: '🌙', meal: 'Herb Salmon & Quinoa', type: 'Dinner', cal: 490 },
  { emoji: '🍎', meal: 'Greek Yogurt Bowl', type: 'Snack', cal: 180 },
];

const FOOD_GROUPS = [
  { name: 'Vegetables', pct: 82, color: '#3D7A42' },
  { name: 'Protein', pct: 90, color: '#1E3F20' },
  { name: 'Grains', pct: 70, color: '#D68C45' },
  { name: 'Fruits', pct: 65, color: '#C05A45' },
  { name: 'Dairy', pct: 45, color: '#8A9A86' },
];

export function DashboardPreview() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="section-spacing bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-[1.15] font-medium text-[#1A241C]">
              Your nutrition dashboard
            </h2>
            <p className="text-base md:text-lg text-[#4A544C] leading-relaxed mt-4 max-w-lg mx-auto">
              Everything at a glance. Beautiful, intuitive, and designed for your goals.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="perspective-container max-w-4xl mx-auto">
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: isHovered ? rotateX : 0,
                rotateY: isHovered ? rotateY : 0,
                transformStyle: 'preserve-3d',
              }}
              className="bg-white rounded-3xl border border-[#E5E0D8] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 md:p-10 transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                  <h3 className="font-heading text-xl font-medium text-[#1A241C]">Weekly Overview</h3>
                  <p className="text-sm text-[#8A9A86]">April 7 - 13, 2026</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#3D7A42]/10 text-[#3D7A42] px-4 py-2 rounded-full">
                    <span className="text-2xl font-heading font-bold">78</span>
                    <span className="text-xs font-medium">Nutrition Score</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3" style={{ transform: 'translateZ(20px)' }}>
                  <h4 className="font-heading text-sm font-semibold text-[#8A9A86] uppercase tracking-wider mb-4">Today&apos;s Plan</h4>
                  {MEAL_PLAN.map((meal, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[#F9F8F6] rounded-2xl px-4 py-3 hover:bg-[#EAE6DF] transition-colors cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{meal.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-[#1A241C]">{meal.meal}</p>
                          <p className="text-xs text-[#8A9A86]">{meal.type}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#4A544C]">{meal.cal} cal</span>
                    </div>
                  ))}
                </div>

                <div style={{ transform: 'translateZ(20px)' }}>
                  <h4 className="font-heading text-sm font-semibold text-[#8A9A86] uppercase tracking-wider mb-4">Food Groups</h4>
                  <div className="space-y-4">
                    {FOOD_GROUPS.map((group) => (
                      <div key={group.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-[#4A544C]">{group.name}</span>
                          <span className="text-sm font-semibold" style={{ color: group.color }}>{group.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#EAE6DF] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${group.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: group.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
