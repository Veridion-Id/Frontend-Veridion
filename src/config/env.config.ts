// Environment configuration with validation

export const env = {
  // App environment
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
  
  // Wallet configuration
  WALLET_NETWORK: (process.env.NEXT_PUBLIC_WALLET_NETWORK || 'testnet') as 'testnet' | 'mainnet',
  WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  
  // API configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // App configuration
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  APP_NAME: 'Veridion',
  APP_DESCRIPTION: 'Unique Humanity Score Verification',
  
  // Feature flags
  FEATURES: {
    AUTO_CONNECT: process.env.NEXT_PUBLIC_AUTO_CONNECT === 'true',
    SHOW_NETWORK_SWITCHER: process.env.NODE_ENV === 'development',
    ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
    ENABLE_DEBUG: process.env.NODE_ENV === 'development',
  },
  
  // RPC endpoints
  RPC_ENDPOINTS: {
    testnet: 'https://soroban-testnet.stellar.org',
    mainnet: 'https://horizon.stellar.org',
  },
} as const;

// Validation
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_APP_URL',
  ] as const;
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Type exports
export type EnvConfig = typeof env;
export type FeatureFlags = typeof env.FEATURES;
