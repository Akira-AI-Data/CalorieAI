'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  Camera,
  Barcode,
  MessageSquare,
  BarChart3,
  Bot,
  TrendingUp,
  ChefHat,
  CalendarDays,
  ShoppingCart,
  Utensils,
  Leaf,
  Zap,
  Users,
  Baby,
  Shield,
  Heart,
  Target,
  Brain,
} from 'lucide-react';

const tabs = [
  { id: 'tracking', label: 'Calorie Tracking' },
  { id: 'recipes', label: 'Recipes & Meal Planning' },
  { id: 'family', label: 'Family & Personalization' },
];

const featuresByTab: Record<string, Array<{ icon: LucideIcon; title: string; description: string }>> = {
  tracking: [
    {
      icon: Camera,
      title: 'AI Photo Scanning',
      description: 'Snap a photo of any meal and let AI instantly identify foods, estimate portions, and calculate calories with remarkable accuracy.',
    },
    {
      icon: Barcode,
      title: 'Barcode Scanner',
      description: 'Scan any packaged food barcode to instantly pull nutritional data from our comprehensive database of over one million products.',
    },
    {
      icon: MessageSquare,
      title: 'Describe Your Meal',
      description: 'Simply type or speak what you ate in natural language. Our AI parses ingredients, portions, and cooking methods to log calories.',
    },
    {
      icon: BarChart3,
      title: 'Macro Dashboard',
      description: 'Track protein, carbs, and fat with precision. Visual breakdowns and daily progress rings make hitting your macros effortless.',
    },
    {
      icon: Bot,
      title: 'AI Nutrition Advisor',
      description: 'Get personalized nutrition advice, meal suggestions, and insights based on your goals, history, and remaining daily macros.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Deep dive into weekly and monthly trends. Understand your eating patterns, celebrate streaks, and stay motivated.',
    },
  ],
  recipes: [
    {
      icon: ChefHat,
      title: 'AI Recipe Generation',
      description: 'Generate personalized recipes from global cuisines using whole, fresh ingredients tailored to your macro goals and dietary needs.',
    },
    {
      icon: CalendarDays,
      title: 'Weekly Meal Planner',
      description: 'Plan Breakfast, Lunch, Dinner, and Snacks across the week. Balanced nutrition and variety made completely effortless.',
    },
    {
      icon: ShoppingCart,
      title: 'Smart Shopping List',
      description: 'Auto-generate shopping lists from your meal plan. Syncs ingredients and diffs against your pantry so you never overbuy.',
    },
    {
      icon: Utensils,
      title: 'Pantry Sync',
      description: 'Track ingredients you have at home. Recipes adapt to what is in your pantry, reducing waste and saving money.',
    },
    {
      icon: Leaf,
      title: 'Cuisine Diversity',
      description: 'Explore Thai, Indian, Italian, Korean, Mexican, and 50+ more cuisines. Every recipe adapted to your dietary restrictions.',
    },
    {
      icon: Zap,
      title: 'Quick Meals',
      description: 'Short on time? Get AI-generated recipes that take 15 minutes or less, using minimal ingredients without sacrificing nutrition.',
    },
  ],
  family: [
    {
      icon: Users,
      title: 'Multi-Profile',
      description: 'Create profiles for every family member. Track nutrition individually for the whole household in one place.',
    },
    {
      icon: Baby,
      title: 'Age-Adaptive Recipes',
      description: 'Recipes tailored to age groups — baby, toddler, teen, adult. Age-appropriate portions, textures, and nutrients automatically.',
    },
    {
      icon: Shield,
      title: 'Allergy Filters',
      description: 'Set allergen profiles per family member. Every recipe and suggestion is automatically screened for safety.',
    },
    {
      icon: Heart,
      title: 'Dietary Preferences',
      description: 'Vegan, vegetarian, gluten-free, keto, paleo — customize recipes and tracking to your lifestyle without sacrificing flavor.',
    },
    {
      icon: Target,
      title: 'Individual Goals',
      description: 'Set unique calorie, macro, and nutrient goals for each family member based on their age, activity level, and health needs.',
    },
    {
      icon: Brain,
      title: 'Smart Recommendations',
      description: 'AI-driven tips and suggestions personalized per profile — warnings, nudges, and success indicators to keep everyone on track.',
    },
  ],
};

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState('tracking');

  return (
    <section id="features" className="py-24 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A9A86]">
            Features
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#1A241C] mt-4">
            Everything you need to eat smarter
          </h2>
          <p className="text-[#4A544C] mt-4 text-base md:text-lg leading-relaxed">
            Powered by advanced AI, CalorieAI makes nutrition tracking, meal planning,
            and recipe discovery effortless, accurate, and genuinely enjoyable.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1E3F20] text-white shadow-md'
                  : 'bg-white text-[#4A544C] hover:text-[#1A241C] border border-[#E5E0D8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feature grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuresByTab[activeTab].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group p-6 rounded-3xl border border-[#E5E0D8] bg-white shadow-[0_2px_8px_rgb(0,0,0,0.03)] hover:shadow-lg hover:shadow-[#1E3F20]/5 transition-all duration-300 hover:-translate-y-1 h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1E3F20]/10 text-[#1E3F20] flex items-center justify-center mb-4">
                  <feature.icon size={22} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A241C] mb-2">{feature.title}</h3>
                <p className="text-[#4A544C] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
