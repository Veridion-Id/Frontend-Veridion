import { WalletNetwork } from '@creit.tech/stellar-wallets-kit';
import { env } from './env.config';

// Wallet configuration
export const WALLET_CONFIG = {
  // Network configuration
  network: env.WALLET_NETWORK === 'testnet' ? WalletNetwork.TESTNET : WalletNetwork.PUBLIC,
  
  // Default wallet selection
  defaultWallet: 'freighter' as const,
  
  // Supported wallets
  supportedWallets: [
    'freighter',
    'albedo', 
    'rabet',
    'walletconnect',
    'xbull'
  ] as const,
  
  // RPC endpoints
  rpcEndpoints: env.RPC_ENDPOINTS,
  
  // App configuration
  app: {
    name: env.APP_NAME,
    description: env.APP_DESCRIPTION,
    url: env.APP_URL,
  },
  
  // Feature flags
  features: {
    autoConnect: env.FEATURES.AUTO_CONNECT,
    showNetworkSwitcher: env.FEATURES.SHOW_NETWORK_SWITCHER,
    enableAnalytics: env.FEATURES.ENABLE_ANALYTICS,
  },
} as const;

// Type exports
export type SupportedWallet = typeof WALLET_CONFIG.supportedWallets[number];
export type NetworkType = 'testnet' | 'mainnet';
