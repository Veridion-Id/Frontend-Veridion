"use client";

import { useVerificationStore, type VerificationType } from '../store/verification-store';

export function useContactVerification(id: 'phone-verification' | 'email-verification') {
  const { isVerificationCompleted, getVerificationStatus, completedVerifications } = useVerificationStore();

  const isCompleted = isVerificationCompleted(id as VerificationType);
  const status = getVerificationStatus(id as VerificationType);

  // Force re-render on store change
  const _subscription = completedVerifications[id];
  void _subscription;

  return {
    isCompleted,
    completedAt: status?.completedAt,
    points: status?.points ?? 0,
  };
}
