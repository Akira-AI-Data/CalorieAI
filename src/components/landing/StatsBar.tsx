'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';

const STATS = [
  { value: 100, suffix: 'K+', label: 'Active Users' },
  { value: 500, suffix: 'K+', label: 'Meals Logged' },
  { value: 4.8, suffix: '/5', label: 'App Rating', isDecimal: true },
  { value: 10, suffix: 'M+', label: 'Calories Tracked' },
];

function AnimatedCounter({ target, suffix, isDecimal = false, inView }: { target: number; suffix: string; isDecimal?: boolean; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, isDecimal]);

  return (
    <span className="font-heading text-4xl md:text-5xl font-semibold text-[#1A241C]">
      {isDecimal ? count.toFixed(1) : count}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative z-10 -mt-8 mb-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl border border-[#E5E0D8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  isDecimal={stat.isDecimal}
                  inView={inView}
                />
                <p className="text-sm text-[#8A9A86] mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
