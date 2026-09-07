import { SplashScreen } from '@/features/landing/components/SplashScreen';
import { ParticlesBackground } from '@/features/landing/components/ParticlesBackground';
import { MusicToggle } from '@/features/landing/components/MusicToggle';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { GroomGallerySection } from '@/features/landing/components/GroomGallerySection';
import { InvitationSection } from '@/features/landing/components/InvitationSection';
import { CountdownSection } from '@/features/landing/components/CountdownSection';
import { EngagementVideoSection } from '@/features/landing/components/EngagementVideoSection';
import { EventDetailsSection } from '@/features/landing/components/EventDetailsSection';
import { MapSection } from '@/features/landing/components/MapSection';
import { FooterSection } from '@/features/landing/components/FooterSection';

export function LandingPage() {
  return (
    <>
      <SplashScreen />
      <ParticlesBackground />
      <MusicToggle />

      <HeroSection />
      <GroomGallerySection />
      <InvitationSection />
      <CountdownSection />
      <EngagementVideoSection />
      <EventDetailsSection />
      <MapSection />
      <FooterSection />
    </>
  );
}
