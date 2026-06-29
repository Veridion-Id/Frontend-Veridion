export function normalizePhone(countryCode: string, local: string): string {
  const digits = local.replace(/\D/g, '');
  return `${countryCode}${digits}`;
}

export function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}

export function formatPhoneDisplay(phone: string): string {
  if (!phone.startsWith('+')) return phone;
  // e.g. +15551234567 → +1 (555) 123-4567  (best-effort, no lib needed)
  const code = phone.slice(0, 2);
  const rest = phone.slice(2);
  if (rest.length === 10) {
    return `${code} (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`;
  }
  return phone;
}

export interface CountryCode {
  code: string;
  flag: string;
  label: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: '+1', flag: '🇺🇸', label: 'United States' },
  { code: '+44', flag: '🇬🇧', label: 'United Kingdom' },
  { code: '+52', flag: '🇲🇽', label: 'Mexico' },
  { code: '+34', flag: '🇪🇸', label: 'Spain' },
  { code: '+57', flag: '🇨🇴', label: 'Colombia' },
  { code: '+54', flag: '🇦🇷', label: 'Argentina' },
  { code: '+55', flag: '🇧🇷', label: 'Brazil' },
  { code: '+56', flag: '🇨🇱', label: 'Chile' },
  { code: '+51', flag: '🇵🇪', label: 'Peru' },
  { code: '+58', flag: '🇻🇪', label: 'Venezuela' },
  { code: '+49', flag: '🇩🇪', label: 'Germany' },
  { code: '+33', flag: '🇫🇷', label: 'France' },
  { code: '+39', flag: '🇮🇹', label: 'Italy' },
  { code: '+31', flag: '🇳🇱', label: 'Netherlands' },
  { code: '+41', flag: '🇨🇭', label: 'Switzerland' },
  { code: '+81', flag: '🇯🇵', label: 'Japan' },
  { code: '+86', flag: '🇨🇳', label: 'China' },
  { code: '+91', flag: '🇮🇳', label: 'India' },
  { code: '+7', flag: '🇷🇺', label: 'Russia' },
  { code: '+82', flag: '🇰🇷', label: 'South Korea' },
  { code: '+61', flag: '🇦🇺', label: 'Australia' },
  { code: '+64', flag: '🇳🇿', label: 'New Zealand' },
  { code: '+27', flag: '🇿🇦', label: 'South Africa' },
  { code: '+234', flag: '🇳🇬', label: 'Nigeria' },
  { code: '+20', flag: '🇪🇬', label: 'Egypt' },
];
