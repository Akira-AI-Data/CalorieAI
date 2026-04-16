import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProof } from '@/components/landing/SocialProof';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { AppPreview } from '@/components/landing/AppPreview';
import { MacroTracking } from '@/components/landing/MacroTracking';
import { Testimonials } from '@/components/landing/Testimonials';
import { PricingSection } from '@/components/landing/PricingSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProof />
      <FeaturesGrid />
      <HowItWorks />
      <AppPreview />
      <MacroTracking />
      <Testimonials />
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  );
}
