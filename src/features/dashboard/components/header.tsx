"use client";

import { Logo } from "@/shared/components/icons/logotype";
import { WalletDropdown } from "@/features/wallet/components/WalletDropdown";

export function Header() {
    return (
        <header className="fixed w-full bg-[#0B0A0A] top-0 z-50 border-b-[2px] border-custom-border px-4 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Logo size="xl" className="pl-6" />
                    </div>
                </div>
                <WalletDropdown className="pr-6" />
            </div>
        </header>
    );
}