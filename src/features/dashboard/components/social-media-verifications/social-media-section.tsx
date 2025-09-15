"use client";

import { Globe } from "lucide-react";
import { VerificationCard } from "../../../verifications/components/verification-card";
import { VerificationModal } from "../../../verifications/components/verification-modal";
import { useVerificationModal } from "../../../verifications/hooks/use-verification-modal";
import { socialMediaVerifications, type SocialMediaVerification } from "../../../verifications/constants/social-verifications";
import { getModalData } from "../../../verifications/constants/modal-data";
import { SectionContainer } from "@/shared/components/section-container";

export function SocialMediaSection() {
    const { isOpen, selectedVerification, openModal, closeModal } = useVerificationModal();

    const handleCardClick = (method: SocialMediaVerification) => {
        openModal(method.id);
    };

    const modalData = getModalData(selectedVerification || '');

    return (
        <>
                <SectionContainer id="social-media-verification" className="p-3 sm:p-4 lg:p-6">
                    <div className="mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
                            <div className="p-1.5 bg-[#112541] border-[1.5px] border-[#055BD0] rounded-full">
                                <Globe className="h-4 w-4 sm:h-6 sm:w-6 lg:h-10 lg:w-10 p-1" />
                            </div>
                            <div className="gap-1 flex flex-col">
                                <h3 className="text-sm sm:text-base font-semibold text-white">Web2 Platforms & Services</h3>
                                <h4 className="text-[14px] text-gray-400">Connect traditional web platforms and services to demonstrate digital presence</h4>
                            </div>
                        </div>
                        <p className="text-gray-400 text-[13px]">
                            Connect your social media and web service accounts to verify your digital identity
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {socialMediaVerifications.map((method: SocialMediaVerification) => (
                        <VerificationCard 
                            key={method.id} 
                            method={method} 
                            type="social" 
                            onClick={() => handleCardClick(method)}
                        />
                    ))}
                </div>
            </SectionContainer>

            {modalData && (
                <VerificationModal
                    isOpen={isOpen}
                    onClose={closeModal}
                    verificationId={selectedVerification || undefined}
                    {...modalData}
                />
            )}
        </>
    );
}
