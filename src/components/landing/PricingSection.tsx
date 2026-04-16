'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';
import { Check, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Get started with tracking and recipes.',
    features: [
      'AI photo scans (3/day)',
      'Basic calorie & macro tracking',
      'AI recipe generation (5/day)',
      'Food database access',
      '1 family profile',
    ],
    cta: 'Get Started',
    popular: false,
    accent: false,
  },
  {
    name: 'Family Pro',
    price: '$9.99',
    period: '/month',
    desc: 'Full power for the whole family.',
    features: [
      'Unlimited AI photo scans',
      'Unlimited AI recipes',
      'Weekly meal planner',
      'Smart shopping list + pantry sync',
      'Multi-profile (5 members)',
      'AI Nutrition Advisor',
      'Nutrition score & food group tracking',
      'Allergy & cuisine filters',
    ],
    cta: 'Start Family Pro Trial',
    popular: true,
    accent: true,
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: '/month',
    desc: 'For nutrition professionals and power users.',
    features: [
      'Everything in Family Pro',
      'Unlimited family profiles',
      'Advanced nutrition intelligence',
      'Nutrient coverage heatmaps',
      'Priority AI processing',
      'Data export & integrations',
      'Dedicated support',
    ],
    cta: 'Start Premium Trial',
    popular: false,
    accent: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="section-spacing bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.2em] font-bold text-[#8A9A86] mb-4">Pricing</p>
            <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-[1.15] font-medium text-[#1A241C]">
              Simple, transparent pricing
            </h2>
            <p className="text-base md:text-lg text-[#4A544C] leading-relaxed mt-4">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={`rounded-3xl p-8 h-full flex flex-col ${
                  plan.accent
                    ? 'bg-[#1E3F20] text-white glow-accent border-2 border-[#C05A45]/30 relative'
                    : 'bg-white border border-[#E5E0D8] shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C05A45] text-white text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <h3 className={`font-heading text-2xl font-medium mb-2 ${plan.accent ? 'text-white' : 'text-[#1A241C]'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`font-heading text-4xl font-bold ${plan.accent ? 'text-white' : 'text-[#1A241C]'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.accent ? 'text-white/70' : 'text-[#8A9A86]'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${plan.accent ? 'text-white/80' : 'text-[#4A544C]'}`}>
                  {plan.desc}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.accent ? 'text-[#D68C45]' : 'text-[#3D7A42]'
                      }`} />
                      <span className={`text-sm ${plan.accent ? 'text-white/90' : 'text-[#4A544C]'}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                    plan.accent
                      ? 'bg-white text-[#1E3F20] hover:bg-[#F9F8F6] hover:shadow-xl'
                      : 'bg-[#1E3F20] text-white hover:bg-[#2A522D] hover:shadow-lg'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
