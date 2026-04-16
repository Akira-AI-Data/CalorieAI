'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';

function FloatingElement({
  children,
  delay = 0,
  duration = 6,
  y = 20,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        y: [-y / 2, y / 2, -y / 2],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-bg-soft via-background to-white -z-10" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-brand-green/5 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-amber/5 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="flex flex-col gap-6 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full">
                AI-Powered Nutrition Tracking
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight"
            >
              Track Every Bite.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-green-dark">
                Powered by AI.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-muted max-w-lg leading-relaxed"
            >
              Snap a photo of your meal and let AI do the rest. Accurate calorie counting,
              macro tracking, and personalized insights to help you reach your goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-2"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-white bg-brand-green hover:bg-brand-green-dark transition-all px-7 py-3.5 rounded-full font-medium shadow-lg shadow-brand-green/20 hover:shadow-brand-green/30 hover:scale-[1.02]"
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-foreground bg-white hover:bg-gray-50 transition-all px-7 py-3.5 rounded-full font-medium border border-border shadow-sm hover:scale-[1.02]"
              >
                <Play size={16} fill="currentColor" />
                See How It Works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-6 mt-4 text-sm text-muted"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-brand-amber">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                4.9/5 rating
              </span>
              <span className="w-px h-4 bg-border" />
              <span>500K+ active users</span>
              <span className="w-px h-4 bg-border hidden sm:block" />
              <span className="hidden sm:block">Free to start</span>
            </motion.div>
          </div>

          {/* Right - Floating Salad Bowl Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            {/* Main salad bowl - primary float */}
            <FloatingElement duration={5} y={15} className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/salad-bowl.png"
                alt="Healthy salad bowl with fresh ingredients"
                width={550}
                height={550}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </FloatingElement>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
