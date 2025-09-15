import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WalletState {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  
  // Wallet info
  publicKey: string | null;
  walletName: string | null;
  
  // Network
  network: 'testnet' | 'mainnet';
  
  // Actions
  setConnecting: (connecting: boolean) => void;
  setConnected: (connected: boolean) => void;
  setWalletInfo: (publicKey: string, walletName: string) => void;
  disconnect: () => void;
  setNetwork: (network: 'testnet' | 'mainnet') => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      // Initial state
      isConnected: false,
      isConnecting: false,
      publicKey: null,
      walletName: null,
      network: 'testnet', // Default to testnet for development
      
      // Actions
      setConnecting: (connecting: boolean) => 
        set({ isConnecting: connecting }),
      
      setConnected: (connected: boolean) => 
        set({ isConnected: connected }),
      
      setWalletInfo: (publicKey: string, walletName: string) => 
        set({ 
          publicKey, 
          walletName, 
          isConnected: true,
          isConnecting: false 
        }),
      
      disconnect: () => 
        set({ 
          isConnected: false,
          isConnecting: false,
          publicKey: null,
          walletName: null 
        }),
      
      setNetwork: (network: 'testnet' | 'mainnet') => 
        set({ network }),
    }),
    {
      name: 'wallet-storage', // unique name for localStorage key
      partialize: (state) => ({
        // Only persist these fields
        isConnected: state.isConnected,
        publicKey: state.publicKey,
        walletName: state.walletName,
        network: state.network,
      }),
    }
  )
);
