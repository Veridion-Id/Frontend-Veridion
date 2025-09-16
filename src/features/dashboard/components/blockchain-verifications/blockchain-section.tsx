"use client";

import { Coins } from "lucide-react";
import { VerificationCard } from "../../../verifications/components/verification-card";
import { blockchainVerifications, type BlockchainVerification } from "../../../verifications/constants/blockchain-verifications";
import { SectionContainer } from "@/shared/components/section-container";

export function BlockchainSection() {
    return (
            <SectionContainer id="blockchain-verification" className="p-3 sm:p-4 lg:p-6">
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
                        <div className="p-1.5 bg-[#112541] border-[1.5px] border-[#055BD0] rounded-full">
                            <Coins className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 p-1" />
                        </div>
                        <div className="gap-1 flex flex-col">
                            <h3 className="text-sm sm:text-base font-semibold text-white">Blockchain Verification</h3>
                            <h4 className="text-[14px] text-gray-text">Verify your blockchain activity and wallet ownership</h4>
                        </div>
                    </div>
                    <p className="text-gray-400 text-[13px]">
                        Methods that verify your activity on various blockchain networks
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {blockchainVerifications.map((method: BlockchainVerification) => (
                    <VerificationCard key={method.id} method={method} type="blockchain" />
                ))}
            </div>
        </SectionContainer>
    );
}
