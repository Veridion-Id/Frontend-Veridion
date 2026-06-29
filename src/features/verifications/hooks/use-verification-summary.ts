"use client";

import { useState, useEffect, useMemo } from 'react';
import { useVerificationStore } from '../store/verification-store';
import {
  buildVerificationSummary,
  type VerificationSummary,
} from '../services/verification-summary';

export function useVerificationSummary(): VerificationSummary {
  const [isHydrated, setIsHydrated] = useState(false);
  const completedVerifications = useVerificationStore(
    (state) => state.completedVerifications,
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return useMemo(
    () => buildVerificationSummary(completedVerifications, isHydrated),
    [completedVerifications, isHydrated],
  );
}
