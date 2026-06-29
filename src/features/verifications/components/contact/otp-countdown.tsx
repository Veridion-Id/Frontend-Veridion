"use client";

import { Clock } from 'lucide-react';

interface OtpCountdownProps {
  cooldown: number;
  onResend: () => void;
  disabled?: boolean;
}

export function OtpCountdown({ cooldown, onResend, disabled = false }: OtpCountdownProps) {
  const canResend = cooldown === 0 && !disabled;

  return (
    <div className="flex items-center gap-1.5">
      {cooldown > 0 && <Clock className="h-3.5 w-3.5 text-gray-500" />}
      <button
        onClick={onResend}
        disabled={!canResend}
        className="text-sm text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
      </button>
    </div>
  );
}
