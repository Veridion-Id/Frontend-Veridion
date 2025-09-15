"use client";

import { useState, useEffect } from 'react';
import { useVerificationStore, type VerificationType } from '../store/verification-store';

export function useVerificationStatus(verificationId: VerificationType) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { isVerificationCompleted, completedVerifications } = useVerificationStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Forzar re-render cuando cambie el store
  const storeState = useVerificationStore((state) => state.completedVerifications);
  
  // Usar directamente el store para obtener el estado actual
  const isCompleted = isHydrated ? isVerificationCompleted(verificationId) : false;

  return { isCompleted, isHydrated };
}
