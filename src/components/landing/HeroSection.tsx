'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

const FLOATING_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1746458174990-25bf2f6a6103?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaXNvbGF0ZWQlMjB3aGl0ZXxlbnwwfHx8fDE3NzYzMTQ2OTl8MA&ixlib=rb-4.1.0&q=85',
    alt: 'Avocado',
    className: 'absolute -top-8 -left-16 md:left-[-8%] w-28 md:w-44 animate-float-slow',
  },
  {
    src: 'https://images.unsplash.com/photo-1587334274535-5f82e7e55dc0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxjaGVycnklMjB0b21hdG9lcyUyMGlzb2xhdGVkJTIwd2hpdGV8ZW58MHx8fHwxNzc2MzE0Njk4fDA&ixlib=rb-4.1.0&q=85',
    alt: 'Cherry Tomatoes',
    className: 'absolute -top-4 -right-12 md:right-[-6%] w-24 md:w-36 animate-float-medium',
  },
  {
    src: 'https://images.unsplash.com/photo-1747292718361-c838a9968ec7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsJTIwdG9wJTIwdmlld3xlbnwwfHx8fDE3NzYzMTQ2OTh8MA&ixlib=rb-4.1.0&q=85',
    alt: 'Salad Bowl',
    className: 'absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 md:w-72 animate-float-fast',
  },
];

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 grain-overlay"
      style={{ backgroundColor: '#F9F8F6' }}
    >
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#1E3F20]/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#C05A45]/5 blur-3xl" />

      <motion.div style={{ y: yBg, opacity }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-[#E5E0D8] mb-8"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A9A86]">
            AI-Powered Nutrition & Meal Planning
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-heading text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.05] font-semibold text-[#1A241C] mb-6"
        >
          Plan. Cook. Track.
          <br />
          <span className="text-[#1E3F20]">All Powered by AI.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-base md:text-lg text-[#4A544C] leading-relaxed max-w-2xl mx-auto mb-10"
        >
          AI-generated recipes from global cuisines, smart meal planning with pantry sync,
          and calorie tracking with photo scanning — everything your family needs in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/dashboard"
            className="group px-8 py-4 rounded-full bg-[#1E3F20] text-white font-semibold text-base hover:bg-[#2A522D] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-4 rounded-full border border-[#E5E0D8] text-[#1A241C] font-semibold text-base hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            See How It Works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex items-center justify-center gap-6 text-sm text-[#4A544C]"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#D68C45] text-[#D68C45]" />
            ))}
            <span className="ml-1 font-semibold">4.9/5</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-[#E5E0D8]" />
          <span className="font-semibold">100K+ active users</span>
          <span className="w-1 h-1 rounded-full bg-[#E5E0D8] hidden sm:block" />
          <span className="font-semibold hidden sm:block">Free to start</span>
        </motion.div>

        <div className="relative mt-16 h-[280px] md:h-[350px] max-w-4xl mx-auto">
          {FLOATING_IMAGES.map((img, i) => (
            <motion.img
              key={i}
              src={img.src}
              alt={img.alt}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 + i * 0.2 }}
              className={`${img.className} food-blend rounded-2xl object-cover`}
              loading="eager"
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
