'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';
import { Clock, Globe } from 'lucide-react';
import { FluentEmoji } from '@/components/ui/FluentEmoji';

const RECIPES = [
  { emoji: '🥗', age: '18-25 years', title: 'Thai Green Curry Bowl', desc: 'Fragrant coconut curry with vegetables and jasmine rice', time: '20 mins', cuisine: 'Thai', color: '#3D7A42' },
  { emoji: '🍝', age: '4-8 years', title: 'Creamy Lentil Pasta', desc: 'Red lentil sauce with herbs and parmesan', time: '15 mins', cuisine: 'Italian', color: '#C05A45' },
  { emoji: '🌮', age: '12-17 years', title: 'Fish Tacos', desc: 'Grilled white fish with mango salsa and lime crema', time: '25 mins', cuisine: 'Mexican', color: '#D68C45' },
  { emoji: '🍲', age: '1-3 years', title: 'Coconut Lentil Soup', desc: 'Creamy red lentil soup with warming spices', time: '5 mins', cuisine: 'Indian', color: '#1E3F20' },
];

const CUISINE_STATS = [
  { label: 'Global Cuisines', value: '20+' },
  { label: 'Age Groups', value: 'Baby to Adult' },
  { label: 'Allergy Filters', value: 'Fully Custom' },
  { label: 'Fresh Ingredients', value: '100%' },
];

export function AICookbookSection() {
  return (
    <section id="cookbook" className="section-spacing bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-4">
            <p className="text-sm uppercase tracking-[0.2em] font-bold text-[#8A9A86] mb-4">AI Cookbook</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {RECIPES.map((recipe, i) => (
            <ScrollReveal key={recipe.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-[#E5E0D8] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <FluentEmoji emoji={recipe.emoji} size={48} />
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ color: recipe.color, backgroundColor: `${recipe.color}12` }}
                  >
                    {recipe.age}
                  </span>
                </div>
                <h4 className="font-heading text-lg font-medium text-[#1A241C] mb-2 group-hover:text-[#1E3F20] transition-colors">
                  {recipe.title}
                </h4>
                <p className="text-sm text-[#4A544C] leading-relaxed mb-4">{recipe.desc}</p>
                <div className="flex items-center gap-4 text-xs text-[#8A9A86]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    {recipe.cuisine}
                  </span>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-[1.15] font-medium text-[#1A241C] mb-6">
                Recipes from every corner of the world
              </h2>
              <p className="text-base md:text-lg text-[#4A544C] leading-relaxed mb-8">
                Our AI generates personalized recipes from Thai, Indian, Italian, Mexican, Korean,
                and dozens more cuisines — using only whole, fresh ingredients. Every recipe is tailored
                to your family&apos;s age groups, allergies, and nutritional needs.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {CUISINE_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl border border-[#E5E0D8] p-4 text-center"
                  >
                    <p className="font-heading text-xl font-semibold text-[#1E3F20]">{stat.value}</p>
                    <p className="text-xs text-[#8A9A86] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/dashboard"
                className="inline-flex px-7 py-3.5 rounded-full bg-[#1E3F20] text-white font-semibold text-sm hover:bg-[#2A522D] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                Try It Free
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1752652012780-8dfb4a5ff008?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMGRpbm5lciUyMGhlYWx0aHl8ZW58MHx8fHwxNzc2MzE0NjkwfDA&ixlib=rb-4.1.0&q=85"
                alt="Family cooking together"
                className="rounded-3xl w-full object-cover h-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                loading="lazy"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 shadow-lg"
              >
                <p className="text-2xl font-heading font-bold text-[#1E3F20]">20+</p>
                <p className="text-xs text-[#4A544C]">Global Cuisines</p>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
