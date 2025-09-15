"use client";

import { Header } from "@/features/dashboard/components/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B0A0A] text-white">
      <Header />
      <main className="pt-[70px]">{children}</main>
    </div>
  );
}