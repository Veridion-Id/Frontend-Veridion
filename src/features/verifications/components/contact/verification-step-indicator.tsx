"use client";

import type { OtpStep } from '../../types/otp.types';

interface Step {
  id: OtpStep;
  label: string;
}

const STEPS: Step[] = [
  { id: 'input', label: 'Enter' },
  { id: 'code', label: 'Verify' },
  { id: 'done', label: 'Done' },
];

interface VerificationStepIndicatorProps {
  currentStep: OtpStep;
}

export function VerificationStepIndicator({ currentStep }: VerificationStepIndicatorProps) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center gap-0 mb-4">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-600'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-px w-10 mx-1 mb-4 transition-colors ${
                  index < currentIndex ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
