import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '../store/wallet-store';
import { getShortAddress as formatShortAddress } from '../services/walletConfig';
import type { WalletConnectionError } from '../types/wallet.types';

export function useWallet() {
  const router = useRouter();
  const {
    isConnected,
    isConnecting,
    publicKey,
    walletName,
    network,
    setConnecting,
    setWalletInfo,
    disconnect,
    setNetwork,
  } = useWalletStore();

  const connectWallet = useCallback(
    (publicKey: string, walletName: string) => {
      setWalletInfo(publicKey, walletName);
      // Navigate to dashboard after successful connection
      router.push('/dashboard');
    },
    [setWalletInfo, router]
  );

  const handleDisconnect = useCallback(() => {
    disconnect();
    // Navigate back to home
    router.push('/');
  }, [disconnect, router]);

  const handleConnectionError = useCallback(
    (error: WalletConnectionError) => {
      console.error('Wallet connection error:', error);
      setConnecting(false);
      // You could add toast notifications here
    },
    [setConnecting]
  );

  const switchNetwork = useCallback(
    (newNetwork: 'testnet' | 'mainnet') => {
      setNetwork(newNetwork);
    },
    [setNetwork]
  );

  const getShortAddress = useCallback(
    (address?: string) => {
      const addr = address || publicKey;
      if (!addr) return '';
      return formatShortAddress(addr);
    },
    [publicKey]
  );

  return {
    // State
    isConnected,
    isConnecting,
    publicKey,
    walletName,
    network,
    
    // Actions
    connectWallet,
    handleDisconnect,
    handleConnectionError,
    switchNetwork,
    getShortAddress,
    
    // Computed
    shortAddress: getShortAddress(),
    isTestnet: network === 'testnet',
    isMainnet: network === 'mainnet',
  };
}
