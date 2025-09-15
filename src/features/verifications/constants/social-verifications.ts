// Social verification methods constants

import { 
  LinkedInIcon, 
  GoogleIcon, 
  DiscordIcon, 
  GitHubIcon 
} from '@/shared/components/icons/social-icons';

export interface SocialMediaVerification {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  points: number;
  status: 'available' | 'verified' | 'completed';
  count?: number;
  maxCount?: number;
}

export const socialMediaVerifications: SocialMediaVerification[] = [
  {
    id: "google",
    title: "Google",
    description: "Verify your Google account ownership",
    icon: GoogleIcon,
    points: 6,
    status: "available",
  },
  {
    id: "discord",
    title: "Discord",
    description: "Verify that you own a Discord account",
    icon: DiscordIcon,
    points: 6,
    status: "available",
  },
  {
    id: "github",
    title: "GitHub",
    description: "Verify your GitHub activity",
    icon: GitHubIcon,
    points: 6,
    status: "verified",
    count: 6,
    maxCount: 6,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    description: "Verify your LinkedIn account ownership",
    icon: LinkedInIcon,
    points: 6,
    status: "available",
  }
];
