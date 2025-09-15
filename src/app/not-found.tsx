import { LandingLayout } from "@/features/landing/components/landing-layout";

export default function NotFound() {
  return (
    <LandingLayout>
    <div className="min-h-screen flex items-center justify-center bg-[#0B0A0A] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg text-gray-400">Page not found</p>
      </div>
    </div>
    </LandingLayout>
  );
}
