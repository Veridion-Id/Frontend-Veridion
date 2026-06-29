"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import type { OtpStep, ContactChannel } from '../types/otp.types';
import { OTP_CONFIG } from '../constants/contact-verifications';

interface UseOtpFlowOptions {
  channel: ContactChannel;
  identifier: string;
  wallet?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useOtpFlow({ channel, identifier, wallet, onSuccess, onError }: UseOtpFlowOptions) {
  const [step, setStep] = useState<OtpStep>('input');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startCooldown = useCallback(() => {
    setCooldown(OTP_CONFIG.resendCooldownSeconds);
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const sendCode = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/verifications/${channel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          [channel]: identifier,
          wallet,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to send code.');
        onError?.(data.error);
        return;
      }
      setStep('code');
      startCooldown();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [channel, identifier, wallet, onError, startCooldown]);

  const verifyCode = useCallback(async () => {
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/verifications/${channel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          [channel]: identifier,
          code,
          wallet,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Verification failed.');
        onError?.(data.error);
        return;
      }
      setStep('done');
      onSuccess?.();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [channel, code, identifier, wallet, onSuccess, onError]);

  const reset = useCallback(() => {
    setStep('input');
    setCode('');
    setError('');
  }, []);

  return { step, code, setCode, loading, error, cooldown, sendCode, verifyCode, reset };
}
