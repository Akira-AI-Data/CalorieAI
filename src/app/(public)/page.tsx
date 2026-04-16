import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsBar } from '@/components/landing/StatsBar';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { AICookbookSection } from '@/components/landing/AICookbookSection';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { NutritionIntelligence } from '@/components/landing/NutritionIntelligence';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FooterSection } from '@/components/landing/FooterSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F8F6' }}>
      <LandingHeader />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <HowItWorksSection />
        <AICookbookSection />
        <DashboardPreview />
        <NutritionIntelligence />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <FooterSection />
    </div>
  );
}
