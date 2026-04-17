'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../animations/ScrollReveal';

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-green via-emerald-500 to-brand-green-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal direction="scale">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Start your nutrition journey today
          </h2>
          <p className="text-white/80 text-lg mt-4 max-w-2xl mx-auto">
            Join 500,000+ people who track smarter with CalorieAI.
            Free to start, no credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-brand-green-dark hover:bg-gray-50 transition-all px-8 py-4 rounded-full font-semibold shadow-xl hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
