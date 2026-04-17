'use client';

import { ScrollReveal } from './ScrollReveal';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "The AI cookbook generates recipes my toddler and teenager both love. The age-based filtering is brilliant — and the pantry sync means I never overbuy groceries.",
    name: 'Sarah M.',
    role: 'Mom of Two',
    avatar: 'https://images.unsplash.com/photo-1673533583016-99a341b07fab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwzfHxwb3J0cmFpdCUyMHNtaWxpbmclMjBwZXJzb24lMjBwbGFpbiUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc2MzE0NjczfDA&ixlib=rb-4.1.0&q=85',
  },
  {
    quote: "I use calorie tracking for macros and the recipe generator for meal prep. Having both in one ecosystem means my nutrition is dialed in from planning to plate.",
    name: 'James K.',
    role: 'Marathon Runner',
    avatar: 'https://images.unsplash.com/photo-1698072556956-1a5d2307a7a1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwyfHxwb3J0cmFpdCUyMHNtaWxpbmclMjBwZXJzb24lMjBwbGFpbiUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc2MzE0NjczfDA&ixlib=rb-4.1.0&q=85',
  },
  {
    quote: "I recommend this to all my patients. The nutrition score, food group balance tracking, and allergen filters make it the most complete family nutrition tool I've seen.",
    name: 'Dr. Emily R.',
    role: 'Pediatric Nutritionist',
    avatar: 'https://images.unsplash.com/photo-1685435688484-b273d9a55879?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHw0fHxwb3J0cmFpdCUyMHNtaWxpbmclMjBwZXJzb24lMjBwbGFpbiUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc2MzE0NjczfDA&ixlib=rb-4.1.0&q=85',
  },
];

const MARQUEE_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

export function TestimonialsSection() {
  return (
    <section className="section-spacing bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.2em] font-bold text-[#8A9A86] mb-4">Testimonials</p>
            <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-[1.15] font-medium text-[#1A241C]">
              Loved by health-conscious people
            </h2>
            <p className="text-base md:text-lg text-[#4A544C] leading-relaxed mt-4 max-w-lg mx-auto">
              Families and fitness enthusiasts love planning, cooking, and tracking with CalorieAI.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="flex animate-marquee">
          {MARQUEE_ITEMS.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[380px] mx-3 bg-white rounded-3xl border border-[#E5E0D8] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#D68C45] text-[#D68C45]" />
                ))}
              </div>
              <p className="text-sm text-[#4A544C] leading-relaxed mb-6 min-h-[80px]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1A241C]">{t.name}</p>
                  <p className="text-xs text-[#8A9A86]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
