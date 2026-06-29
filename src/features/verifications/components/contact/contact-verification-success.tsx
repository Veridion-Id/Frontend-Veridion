"use client";

import { CheckCircle } from 'lucide-react';

interface ContactVerificationSuccessProps {
  channel: 'phone' | 'email';
  identifier: string;
  points: number;
}

export function ContactVerificationSuccess({
  channel,
  identifier,
  points,
}: ContactVerificationSuccessProps) {
  const label = channel === 'phone' ? 'Phone' : 'Email';

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
        <CheckCircle className="h-9 w-9 text-green-400" />
      </div>
      <div>
        <p className="text-white font-semibold text-lg">{label} verified!</p>
        <p className="text-gray-400 text-sm mt-1">{identifier}</p>
      </div>
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-5 py-2">
        <span className="text-green-400 font-bold text-lg">+{points}</span>
        <span className="text-green-400/70 text-sm ml-1">points awarded</span>
      </div>
    </div>
  );
}
