'use client';

import { ScrollReveal } from '../animations/ScrollReveal';
import { Check } from 'lucide-react';

const sections = [
  {
    title: 'Precise macro breakdowns',
    description:
      'See exactly how your meals split across protein, carbs, and fat. Our AI analyzes portion sizes and ingredients for accuracy that rivals a nutritionist.',
    points: [
      'Real-time macro calculations',
      'Visual progress bars for each nutrient',
      'Daily, weekly, and monthly trends',
    ],
    imagePosition: 'right' as const,
    gradient: 'from-green-100 to-emerald-50',
  },
  {
    title: 'AI-powered meal suggestions',
    description:
      'Based on your remaining macros and preferences, NourishSnap recommends meals to perfectly balance your day. Never guess what to eat next.',
    points: [
      'Personalized recommendations',
      'Adapts to dietary restrictions',
      'Learns from your eating patterns',
    ],
    imagePosition: 'left' as const,
    gradient: 'from-amber-100 to-orange-50',
  },
];

export function MacroTracking() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sections.map((section, i) => (
          <div
            key={i}
            className={`grid md:grid-cols-2 gap-12 items-center ${i > 0 ? 'mt-24' : ''} ${
              section.imagePosition === 'left' ? 'md:flex-row-reverse' : ''
            }`}
          >
            <ScrollReveal direction={section.imagePosition === 'right' ? 'left' : 'right'}>
              <div className={section.imagePosition === 'left' ? 'md:order-2' : ''}>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {section.title}
                </h3>
                <p className="text-muted leading-relaxed mb-6">{section.description}</p>
                <ul className="space-y-3">
                  {section.points.map((point, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-foreground">
                      <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-brand-green" />
                      </div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal direction={section.imagePosition === 'right' ? 'right' : 'left'}>
              <div className={`rounded-3xl bg-gradient-to-br ${section.gradient} p-8 h-72 flex items-center justify-center ${section.imagePosition === 'left' ? 'md:order-1' : ''}`}>
                <div className="w-full max-w-xs space-y-4">
                  {[
                    { label: 'Protein', pct: 75, color: '#22C55E' },
                    { label: 'Carbs', pct: 60, color: '#F59E0B' },
                    { label: 'Fat', pct: 45, color: '#3B82F6' },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-foreground">{bar.label}</span>
                        <span className="text-muted">{bar.pct}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/60 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${bar.pct}%`, backgroundColor: bar.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </section>
  );
}
