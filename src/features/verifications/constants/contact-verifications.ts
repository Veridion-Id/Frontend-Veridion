import { Smartphone, Mail } from 'lucide-react';

export interface ContactVerification {
  id: string;
  title: string;
  description: string;
  icon: typeof Smartphone;
  points: number;
  channel: 'phone' | 'email';
  estimatedTime: string;
}

export const contactVerifications: ContactVerification[] = [
  {
    id: 'phone-verification',
    title: 'Phone Verification',
    description: 'Verify your identity using a 6-digit SMS code',
    icon: Smartphone,
    points: 1000,
    channel: 'phone',
    estimatedTime: '< 2 minutes',
  },
  {
    id: 'email-verification',
    title: 'Email Verification',
    description: 'Verify your identity using a 6-digit email code',
    icon: Mail,
    points: 500,
    channel: 'email',
    estimatedTime: '< 2 minutes',
  },
];

export const OTP_CONFIG = {
  length: 6,
  ttlMinutes: 10,
  maxAttempts: 5,
  resendCooldownSeconds: 60,
  rateLimitWindow: 10, // minutes
  rateLimitMax: 3,
} as const;
