import type { OtpEntry, OtpVerifyResult } from '../types/otp.types';

// In-memory stores — replace with Redis in production
const otpStore = new Map<string, OtpEntry>();
const bindingStore = new Map<string, string>(); // identifierHash → walletAddress

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOtp(key: string, code: string): void {
  otpStore.set(key, { code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });
}

export function verifyOtp(key: string, code: string): OtpVerifyResult {
  const entry = otpStore.get(key);
  if (!entry) return 'expired';

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return 'expired';
  }

  entry.attempts += 1;
  if (entry.attempts > MAX_ATTEMPTS) return 'too-many-attempts';

  if (entry.code !== code) return 'invalid';

  otpStore.delete(key);
  return 'ok';
}

export async function hashIdentifier(identifier: string, _wallet: string): Promise<string> {
  const salt = process.env.OTP_SALT ?? 'veridion-salt-change-me';
  const encoded = new TextEncoder().encode(`${salt}:${identifier.toLowerCase()}`);
  const buffer = encoded.buffer.slice(
    encoded.byteOffset,
    encoded.byteOffset + encoded.byteLength
  ) as ArrayBuffer;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function checkBinding(identifierHash: string, wallet: string): 'free' | 'same-wallet' | 'other-wallet' {
  const bound = bindingStore.get(identifierHash);
  if (!bound) return 'free';
  return bound === wallet ? 'same-wallet' : 'other-wallet';
}

export function setBinding(identifierHash: string, wallet: string): void {
  bindingStore.set(identifierHash, wallet);
}
