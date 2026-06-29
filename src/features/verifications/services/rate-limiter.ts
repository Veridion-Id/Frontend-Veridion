import type { RateLimitEntry } from '../types/otp.types';

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX_REQUESTS = 3;

export function checkRateLimit(key: string, max = MAX_REQUESTS, windowMs = WINDOW_MS): boolean {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now - record.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (record.count >= max) return false;

  record.count += 1;
  return true;
}

export function getRemainingRequests(key: string, max = MAX_REQUESTS): number {
  const record = store.get(key);
  if (!record || Date.now() - record.windowStart > WINDOW_MS) return max;
  return Math.max(0, max - record.count);
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}
