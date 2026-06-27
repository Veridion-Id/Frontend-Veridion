// Physical verification methods constants

import { 
  CreditCard, 
  Smartphone, 
  Eye, 
  HandMetal
} from 'lucide-react';

export interface PhysicalVerification {
  id: string;
  title: string;
  description: string;
  icon: typeof CreditCard;
  isSecured: boolean;
  points: number;
  count: number;
}

export const physicalVerifications: PhysicalVerification[] = [
  {
    id: "government-id",
    title: "Government ID",
    description: "Use government identification to verify your identity",
    icon: CreditCard,
    isSecured: true,
    points: 1000,
    count: 100,
  },
  {
    id: "binance",
    title: "Binance",
    description: "Verify KYC using Binance Account Bound Token",
    icon: CreditCard,
    isSecured: false,
    points: 1000,
    count: 10,
  },
  {
    id: "phone-verification",
    title: "Phone Verification",
    description: "Verify your identity using phone number",
    icon: Smartphone,
    isSecured: true,
    points: 1000,
    count: 15,
  },
  {
    id: "biometrics",
    title: "Biometrics",
    description: "Verify your uniqueness using facial biometrics",
    icon: Eye,
    isSecured: true,
    points: 1000,
    count: 5,
  },
  {
    id: "proof-clean-hands",
    title: "Proof of Clean Hands",
    description: "Prove you're not on sanctions lists",
    icon: HandMetal,
    isSecured: true,
    points: 1000,
    count: 1,
  },
];
