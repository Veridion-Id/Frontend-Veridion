"use client";

import { useRef, KeyboardEvent, ClipboardEvent } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, length = 6, disabled = false }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.padEnd(length, '').slice(0, length).split('');

  function handleChange(index: number, char: string) {
    const digit = char.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, i) => (i === index ? digit : d)).join('').replace(/\s/g, '');
    onChange(next);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const next = digits.map((d, i) => (i === index - 1 ? '' : d)).join('');
      onChange(next);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] === ' ' ? '' : digits[i]}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          disabled={disabled}
          className={`
            w-11 h-14 text-center text-xl font-bold rounded-lg border
            bg-gray-800 text-white caret-blue-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
            ${digits[i] && digits[i] !== ' ' ? 'border-blue-500' : 'border-gray-600'}
          `}
        />
      ))}
    </div>
  );
}
