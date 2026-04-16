'use client';

import { Camera, BarChart3, TrendingUp } from 'lucide-react';
import { ScrollReveal } from '../animations/ScrollReveal';

const steps = [
  {
    number: '01',
    icon: Camera,
    title: 'Snap',
    description: 'Take a photo of your meal or scan a barcode. Our AI processes it in seconds.',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Track',
    description: 'See a detailed breakdown of calories, macros, and nutrients. Edit and adjust as needed.',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Thrive',
    description: 'Get insights, hit your goals, and build sustainable healthy habits with AI coaching.',
    gradient: 'from-blue-400 to-indigo-500',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-brand-bg-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4">
              Three steps to better nutrition
            </h2>
            <p className="text-muted mt-4 text-lg">
              Getting started takes less than a minute. No complicated setup required.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-green-300 via-amber-300 to-blue-300" />

          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.15} direction="up">
              <div className="relative flex flex-col items-center text-center">
                {/* Number badge */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg relative z-10`}>
                  <step.icon size={28} className="text-white" />
                </div>
                <span className="text-xs font-bold text-brand-green tracking-widest uppercase mb-2">
                  Step {step.number}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
