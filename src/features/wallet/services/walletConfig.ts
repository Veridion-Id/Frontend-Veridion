// Wallet configuration and utilities

import type { WalletConnectionError } from '../types/wallet.types';

/**
 * Initialize wallet kit with proper error handling
 */
export async function initializeWalletKit() {
  try {
    const { 
      StellarWalletsKit,
      FreighterModule,
      AlbedoModule,
      RabetModule,
    } = await import('@creit.tech/stellar-wallets-kit');
    
    const { WALLET_CONFIG } = await import('@/config/wallet.config');
    
    const walletKit = new StellarWalletsKit({
      network: WALLET_CONFIG.network,
      modules: [
        new FreighterModule(),
        new AlbedoModule(),
        new RabetModule(),
      ],
    });
    
    return walletKit;
  } catch (error) {
    console.error('Failed to initialize wallet kit:', error);
    throw new Error('Wallet initialization failed');
  }
}

/**
 * Connect to wallet with error handling
 */
export async function connectWallet(
  kit: {
    openModal: (options: { onWalletSelected: (option: { id: string; name: string }) => Promise<void> }) => Promise<void>;
    setWallet: (id: string) => void;
    getAddress: () => Promise<{ address: string }>;
  },
  onWalletSelected: (publicKey: string, walletName: string) => void
): Promise<void> {
  try {
    await kit.openModal({
      onWalletSelected: async (option: { id: string; name: string }) => {
        kit.setWallet(option.id);
        const { address } = await kit.getAddress();
        onWalletSelected(address, option.name);
      },
    });
  } catch (error) {
    const walletError: WalletConnectionError = {
      code: 'CONNECTION_ERROR',
      message: error instanceof Error ? error.message : 'Failed to connect wallet',
      details: error,
    };
    throw walletError;
  }
}

/**
 * Validate wallet address format
 */
export function validateAddress(address: string): boolean {
  // Basic Stellar address validation
  return /^[A-Z0-9]{56}$/.test(address);
}

/**
 * Get short address format
 */
export function getShortAddress(address: string, startChars: number = 3, endChars: number = 3): string {
  if (!address) return '';
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}