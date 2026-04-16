'use client';

import { ScrollReveal } from '../animations/ScrollReveal';
import { CountUp } from '../animations/CountUp';

const stats = [
  { value: 500000, label: 'Active Users', suffix: '+', prefix: '' },
  { value: 1000000, label: 'Foods in Database', suffix: '+', prefix: '' },
  { value: 4.9, label: 'App Store Rating', suffix: '/5', prefix: '' },
  { value: 50, label: 'Million Meals Tracked', suffix: 'M+', prefix: '' },
];

export function SocialProof() {
  return (
    <section className="py-16 border-y border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value < 10 ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <CountUp
                      end={stat.value >= 1000000 ? stat.value / 1000 : stat.value >= 1000 ? stat.value / 1000 : stat.value}
                      suffix={stat.value >= 1000000 ? 'K+' : stat.value >= 1000 ? 'K+' : stat.suffix}
                      duration={2.5}
                    />
                  )}
                </div>
                <p className="text-sm text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
