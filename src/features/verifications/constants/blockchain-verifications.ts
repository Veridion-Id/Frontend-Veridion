// Blockchain verification methods constants

import { StellarIcon } from '@/shared/components/icons/stellar-icon';

export interface BlockchainVerification {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  points: number;
  status: 'available' | 'verified' | 'completed';
  count?: number;
  maxCount?: number;
  level?: string;
}

export const blockchainVerifications: BlockchainVerification[] = [
  {
    id: "stellar-transactions",
    title: "Stellar Transactions",
    description: "Verify your Stellar wallet activity and transaction history",
    icon: StellarIcon,
    points: 0, // Se calculará dinámicamente
    status: "available",
    level: "No Activity"
  }
];
