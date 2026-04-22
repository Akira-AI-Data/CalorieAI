'use client';

import { Camera, PieChart, Lightbulb, Database, Droplets, Dumbbell } from 'lucide-react';
import { ScrollReveal } from '../animations/ScrollReveal';

const features = [
  {
    icon: Camera,
    title: 'AI Photo Recognition',
    description: 'Simply snap a photo of your meal. Our AI identifies foods and calculates nutritional values instantly.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: PieChart,
    title: 'Macro Tracking',
    description: 'Track protein, carbs, and fat with precision. Visual breakdowns make hitting your macros effortless.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Lightbulb,
    title: 'Smart Suggestions',
    description: 'Get personalized meal recommendations and insights based on your goals and eating patterns.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Database,
    title: '1M+ Food Database',
    description: 'Access over one million foods with barcode scanning. Every meal is just a scan away.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Droplets,
    title: 'Water Tracking',
    description: 'Stay hydrated with smart reminders and daily water intake goals tailored to your body.',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: Dumbbell,
    title: 'Exercise Integration',
    description: 'Sync your workouts and adjust calorie goals automatically. Fitness and nutrition in one place.',
    color: 'bg-rose-50 text-rose-600',
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-4">
              Everything you need to track smarter
            </h2>
            <p className="text-muted mt-4 text-lg">
              Powered by advanced AI, Posha makes nutrition tracking effortless and accurate.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction="up">
              <div className="group p-6 rounded-2xl border border-border bg-white hover:shadow-lg hover:shadow-brand-green/5 transition-all duration-300 hover:-translate-y-1 h-full">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
