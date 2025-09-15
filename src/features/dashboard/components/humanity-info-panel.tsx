"use client";

import { Separator } from "@/shared/components/separator";
import { Button } from "@/shared/ui/button";
import { Info } from "lucide-react";
import { Symbol } from "@/shared/components/icons/symbol";

export function HumanityInfoPanel() {
    return (
        <div className="space-y-4 relative z-10">
            <div>
                <h2 className="text-xl font-semibold text-lighter-gray-text mb-2">
                    Let&apos;s increase that<br />
                    Unique humanity score!
                </h2>
                <p className="text-gray-text text-sm mb-3">
                    You will need at least <span className="text-white font-semibold">20 points</span> to verify your humanity and qualify for Veridion Points
                </p>
            </div>

            <div>
                <p className="text-white text-sm mb-2">Need some help?</p>
                <div className="inline-flex items-center gap-2 text-xs text-gray-400 mb-3 rounded-full bg-[#151514] border-[1.1px] border-[#A0A0A1] px-2 py-1">
                    <Info color="#A0A0A1" className="h-3 w-3" />
                    <span className="text-gray-text text-[13px]">Here are some tips on how to raise your Unique Humanity Score</span>
                </div>

                <Separator className="relative z-0 mb-5 mt-3" />

                <Button
                    className="bg-button-verify hover:bg-gray text-white px-6 py-3 rounded-lg w-full sm:w-auto"
                    onClick={() => {
                        const element = document.getElementById('physical-verification');
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}
                >
                    <Symbol className="h-4 w-4 mr-2" />
                    Verify Stamps
                </Button>
            </div>
        </div>
    );
}