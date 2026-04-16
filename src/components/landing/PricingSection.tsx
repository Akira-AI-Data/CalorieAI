'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { ScrollReveal } from '../animations/ScrollReveal';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic calorie tracking.',
    features: [
      'AI photo recognition (5/day)',
      'Basic macro tracking',
      'Food database access',
      'Daily calorie goals',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Everything you need for serious nutrition tracking.',
    features: [
      'Unlimited AI photo scans',
      'Advanced macro & micro tracking',
      'Barcode scanning',
      'Personalized AI suggestions',
      'Water & exercise tracking',
      'Weekly progress reports',
    ],
    cta: 'Start Pro Trial',
    featured: true,
  },
  {
    name: 'Max',
    price: '$19.99',
    period: '/month',
    description: 'For athletes and professionals who want it all.',
    features: [
      'Everything in Pro',
      'AI meal planning',
      'Advanced body composition',
      'Priority AI processing',
      'Export data & integrations',
      'Dedicated support',
    ],
    cta: 'Start Max Trial',
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted mt-4 text-lg">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction="up">
              <div
                className={`relative p-6 rounded-2xl border h-full flex flex-col ${
                  plan.featured
                    ? 'border-brand-green bg-brand-bg-soft shadow-lg shadow-brand-green/10 scale-[1.02]'
                    : 'border-border bg-white'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold text-white bg-brand-green px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <div className="mt-3 mb-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted text-sm ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-muted mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-foreground">
                      <Check size={16} className="text-brand-green flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`block text-center py-3 rounded-full font-medium text-sm transition-all ${
                    plan.featured
                      ? 'bg-brand-green text-white hover:bg-brand-green-dark shadow-lg shadow-brand-green/20'
                      : 'bg-foreground/5 text-foreground hover:bg-foreground/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
