import React from 'react';

interface StellarIconProps {
  size?: number;
  className?: string;
}

export const StellarIcon: React.FC<StellarIconProps> = ({ 
  size = 24, 
  className = '' 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stellar Logo - Simplified version */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#stellarGradient)"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      
      {/* Stellar star pattern */}
      <path
        d="M12 2L13.5 8.5L20 7L14.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9.5 12L4 7L10.5 8.5L12 2Z"
        fill="white"
        opacity="0.9"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="stellarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7D00FF" />
          <stop offset="50%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#7D00FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default StellarIcon;
