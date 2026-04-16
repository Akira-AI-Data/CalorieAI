'use client';

import { ScrollReveal } from '../animations/ScrollReveal';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Fitness Enthusiast',
    avatar: 'S',
    avatarBg: 'bg-green-100 text-green-700',
    quote: 'NourishSnap completely changed how I think about food. The photo scanning is incredibly accurate and saves me so much time every day.',
    rating: 5,
  },
  {
    name: 'James K.',
    role: 'Marathon Runner',
    avatar: 'J',
    avatarBg: 'bg-amber-100 text-amber-700',
    quote: 'As an athlete, getting my macros right is crucial. This app makes it effortless. The AI suggestions for pre and post workout meals are a game-changer.',
    rating: 5,
  },
  {
    name: 'Dr. Emily R.',
    role: 'Nutritionist',
    avatar: 'E',
    avatarBg: 'bg-blue-100 text-blue-700',
    quote: 'I recommend NourishSnap to all my clients. The accuracy of the AI recognition and the comprehensive food database are genuinely impressive.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-brand-bg-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4">
              Loved by health-conscious people
            </h2>
            <p className="text-muted mt-4 text-lg">
              Join thousands who&apos;ve transformed their nutrition habits with NourishSnap.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction="up">
              <div className="p-6 rounded-2xl bg-white border border-border shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-brand-amber text-sm">&#9733;</span>
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center font-semibold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
