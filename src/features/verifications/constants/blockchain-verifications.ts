// Blockchain verification methods constants

export interface BlockchainVerification {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  points: number;
  status: 'available' | 'verified' | 'completed';
  count?: number;
  maxCount?: number;
}

export const blockchainVerifications: BlockchainVerification[] = [
  // TODO: Add blockchain verification methods
];
