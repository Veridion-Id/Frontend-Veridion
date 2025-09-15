"use client";

import { useState, useEffect } from 'react';
import { useVerificationStore, type VerificationType } from '../store/verification-store';

export function useVerificationStatus(verificationId: VerificationType) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { isVerificationCompleted } = useVerificationStore();

  useEffect(() => {
    setIsHydrated(true);
    setIsCompleted(isVerificationCompleted(verificationId));
  }, [verificationId, isVerificationCompleted]);

  return { isCompleted, isHydrated };
}
