"use client";

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/shared/ui/button';
import { useWallet } from '../hooks/useWallet';
import { initializeWalletKit, connectWallet as connectWalletService } from '../services/walletConfig';
import { Wallet, ExternalLink } from 'lucide-react';

export function ConnectWallet() {
  const {
    isConnected,
    isConnecting,
    publicKey,
    connectWallet,
    handleDisconnect,
    handleConnectionError,
  } = useWallet();
  
  const [isWalletKitReady, setIsWalletKitReady] = useState(false);
  const [kit, setKit] = useState<{
    openModal: (options: { onWalletSelected: (option: { id: string; name: string }) => Promise<void> }) => Promise<void>;
    setWallet: (id: string) => void;
    getAddress: () => Promise<{ address: string }>;
  } | null>(null);

  // Initialize wallet kit on client side only
  useEffect(() => {
    const initializeKit = async () => {
      try {
        const walletKit = await initializeWalletKit();
        setKit(walletKit);
        setIsWalletKitReady(true);
      } catch (error) {
        console.error('Failed to initialize wallet kit:', error);
        setIsWalletKitReady(true); // Still show UI even if kit fails
      }
    };

    initializeKit();
  }, []);

  // Handle wallet connection
  const handleConnectWallet = useCallback(async () => {
    if (!kit) {
      console.error('Wallet kit not initialized');
      return;
    }

    try {
        await connectWalletService(kit, connectWallet);
    } catch (error) {
      handleConnectionError({
        code: 'CONNECTION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to connect wallet',
        details: error,
      });
    }
  }, [kit, connectWallet, handleConnectionError]);

  // If wallet is already connected, show connected state
  if (isConnected && publicKey) {
    return (
      <div className="flex gap-2">
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          className="bg-black hover:bg-button-verify/80 px-8 py-4 text-lg"
        >
          <ExternalLink className="h-6 w-6 mr-3" />
          Go to Dashboard
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDisconnect}
          className="border-gray-600 text-gray-text hover:bg-gray-800 px-8 py-4 text-lg"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  // Show wallet connection interface
  if (!isWalletKitReady || !kit) {
    return (
      <Button disabled className="bg-button-verify px-8 py-4 text-lg">
        <Wallet className="h-6 w-6 mr-3" />
        Loading...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleConnectWallet}
      disabled={isConnecting}
      className="bg-transparent border border-white hover:bg-white/10 px-6 py-3 text-base text-white"
    >
      <Wallet size={20} className="mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect your wallet'}
    </Button>
  );
}
