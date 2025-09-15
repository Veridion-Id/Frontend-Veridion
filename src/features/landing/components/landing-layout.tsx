"use client";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="h-screen bg-[#0B0A0A] text-white overflow-hidden">
      {children}
    </div>
  );
}
