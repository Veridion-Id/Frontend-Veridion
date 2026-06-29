import { generateOtp, storeOtp, verifyOtp } from '../otp-service';
import { checkRateLimit, resetRateLimit } from '../rate-limiter';
import { isDisposableEmail } from '../disposable-domains';
import { isValidEmail } from '../../utils/email-utils';
import { isValidE164, normalizePhone } from '../../utils/phone-utils';

// generateOtp
describe('generateOtp', () => {
  it('returns a 6-digit string', () => {
    const code = generateOtp();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('generates unique codes', () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateOtp()));
    expect(codes.size).toBeGreaterThan(10);
  });
});

// verifyOtp
describe('verifyOtp', () => {
  it('returns ok for correct code', () => {
    storeOtp('test:correct', '123456');
    expect(verifyOtp('test:correct', '123456')).toBe('ok');
  });

  it('returns expired when key does not exist', () => {
    expect(verifyOtp('test:nonexistent', '000000')).toBe('expired');
  });

  it('returns invalid for wrong code', () => {
    storeOtp('test:wrong', '111111');
    expect(verifyOtp('test:wrong', '999999')).toBe('invalid');
  });

  it('returns too-many-attempts after 5 failures', () => {
    storeOtp('test:attempts', '111111');
    for (let i = 0; i < 5; i++) verifyOtp('test:attempts', '000000');
    expect(verifyOtp('test:attempts', '000000')).toBe('too-many-attempts');
  });

  it('deletes code after successful verify (idempotent)', () => {
    storeOtp('test:idempotent', '654321');
    expect(verifyOtp('test:idempotent', '654321')).toBe('ok');
    expect(verifyOtp('test:idempotent', '654321')).toBe('expired');
  });
});

// rate-limiter
describe('checkRateLimit', () => {
  it('allows requests up to the max', () => {
    const key = `rl-test:${Date.now()}`;
    expect(checkRateLimit(key, 3)).toBe(true);
    expect(checkRateLimit(key, 3)).toBe(true);
    expect(checkRateLimit(key, 3)).toBe(true);
    expect(checkRateLimit(key, 3)).toBe(false);
  });

  it('resets after calling resetRateLimit', () => {
    const key = `rl-reset:${Date.now()}`;
    checkRateLimit(key, 1);
    expect(checkRateLimit(key, 1)).toBe(false);
    resetRateLimit(key);
    expect(checkRateLimit(key, 1)).toBe(true);
  });
});

// disposable-domains
describe('isDisposableEmail', () => {
  it('blocks known disposable domains', () => {
    expect(isDisposableEmail('user@mailinator.com')).toBe(true);
    expect(isDisposableEmail('x@guerrillamail.com')).toBe(true);
    expect(isDisposableEmail('a@yopmail.com')).toBe(true);
  });

  it('allows legitimate domains', () => {
    expect(isDisposableEmail('user@gmail.com')).toBe(false);
    expect(isDisposableEmail('user@outlook.com')).toBe(false);
  });
});

// email-utils
describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('a+b@sub.domain.org')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
  });
});

// phone-utils
describe('isValidE164', () => {
  it('accepts valid E.164 numbers', () => {
    expect(isValidE164('+15551234567')).toBe(true);
    expect(isValidE164('+447700900000')).toBe(true);
  });

  it('rejects invalid numbers', () => {
    expect(isValidE164('5551234567')).toBe(false);
    expect(isValidE164('+1')).toBe(false);
    expect(isValidE164('')).toBe(false);
  });
});

describe('normalizePhone', () => {
  it('strips non-digits from local part and prepends country code', () => {
    expect(normalizePhone('+1', '(555) 123-4567')).toBe('+15551234567');
    expect(normalizePhone('+52', '55 1234 5678')).toBe('+52551234567 8'.replace(/\s/g, ''));
  });
});
