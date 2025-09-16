"use client";

import { DashboardLayout } from "@/features/dashboard/layout/dashboard-layout";
import { HumanityScoreSection } from "@/features/dashboard/components/humanity-secore-section";
import { VerificationSection } from "@/features/dashboard/components/physical-verifications/verification-section";
import { SocialMediaSection } from "@/features/dashboard/components/social-media-verifications/social-media-section";
import { BlockchainSection } from "@/features/dashboard/components/blockchain-verifications/blockchain-section";

export default function Dashboard() {
  return (
    <>
      <DashboardLayout>
        <div className="py-6 px-4 sm:py-8 sm:px-6 lg:py-12 lg:px-16 xl:px-24">
          <HumanityScoreSection />

          <div className="space-y-8">
            <SocialMediaSection />
            <BlockchainSection />
            <VerificationSection />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
