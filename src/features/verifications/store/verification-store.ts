import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VerificationType = 'google' | 'github' | 'linkedin' | 'discord' | 'government-id' | 'binance' | 'phone-verification' | 'biometrics' | 'proof-clean-hands';

export interface VerificationStatus {
  id: VerificationType;
  type: 'social' | 'physical' | 'blockchain';
  completed: boolean;
  completedAt?: Date;
  points: number;
}

export interface VerificationState {
  // Verificaciones completadas
  completedVerifications: Record<string, VerificationStatus>;
  
  // Puntos totales
  totalPoints: number;
  
  // Actions
  completeVerification: (id: VerificationType, type: 'social' | 'physical' | 'blockchain', points: number) => void;
  resetVerification: (id: VerificationType) => void;
  resetAllVerifications: () => void;
  isVerificationCompleted: (id: VerificationType) => boolean;
  getVerificationStatus: (id: VerificationType) => VerificationStatus | null;
}

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      completedVerifications: {},
      totalPoints: 0,
      
      // Actions
      completeVerification: (id: VerificationType, type: 'social' | 'physical' | 'blockchain', points: number) => {
        const state = get();
        const now = new Date();
        
        console.log('Completing verification:', { id, type, points });
        console.log('Current state:', state);
        
        set({
          completedVerifications: {
            ...state.completedVerifications,
            [id]: {
              id,
              type,
              completed: true,
              completedAt: now,
              points,
            },
          },
          totalPoints: state.totalPoints + points,
        });
        
        console.log('New state after completion:', get());
      },
      
      resetVerification: (id: VerificationType) => {
        const state = get();
        const verification = state.completedVerifications[id];
        
        if (verification) {
          const newCompletedVerifications = { ...state.completedVerifications };
          delete newCompletedVerifications[id];
          
          set({
            completedVerifications: newCompletedVerifications,
            totalPoints: state.totalPoints - verification.points,
          });
        }
      },
      
      resetAllVerifications: () => {
        set({
          completedVerifications: {},
          totalPoints: 0,
        });
      },
      
      isVerificationCompleted: (id: VerificationType) => {
        const state = get();
        return state.completedVerifications[id]?.completed || false;
      },
      
      getVerificationStatus: (id: VerificationType) => {
        const state = get();
        return state.completedVerifications[id] || null;
      },
    }),
    {
      name: 'verification-storage',
      partialize: (state) => ({
        completedVerifications: state.completedVerifications,
        totalPoints: state.totalPoints,
      }),
    }
  )
);
