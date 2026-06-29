"use client";

import { COUNTRY_CODES, type CountryCode } from '../../utils/phone-utils';

interface CountryCodeSelectorProps {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export function CountryCodeSelector({ value, onChange, disabled = false }: CountryCodeSelectorProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="bg-gray-800 border border-gray-600 text-white rounded-lg px-2 py-2.5 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px]"
    >
      {COUNTRY_CODES.map((c: CountryCode) => (
        <option key={c.code} value={c.code}>
          {c.flag} {c.code}
        </option>
      ))}
    </select>
  );
}
