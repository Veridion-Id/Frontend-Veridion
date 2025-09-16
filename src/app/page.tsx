"use client";

import { LandingLayout } from "@/features/landing/components/landing-layout";
import { HeroSection } from "@/features/landing/components/hero-section";
import { WalletRegistrationWrapper } from "@/components/wallet/wallet-registration-wrapper";

export default function LandingPage() {
  return (
    <WalletRegistrationWrapper>
      <LandingLayout>
        <HeroSection />
      </LandingLayout>
    </WalletRegistrationWrapper>
  );
}
