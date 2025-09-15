"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/ui/button';
import { DiscordIcon } from '@/shared/components/icons/social-icons';
import { useVerificationStore } from '../../../store/verification-store';

interface DiscordAuthProps {
  onSuccess?: (user: unknown) => void;
  onError?: (error: unknown) => void;
}

export function DiscordAuth({ onSuccess, onError }: DiscordAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { completeVerification, isVerificationCompleted } = useVerificationStore();

  const handleDiscordCallback = useCallback(async (code: string) => {
    setIsLoading(true);
    
    try {
      // Call the API endpoint instead of direct import
      const response = await fetch('/verifications/discord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Discord');
      }

      const data = await response.json();
      const user = data.user;

      // Complete the verification
      completeVerification('discord', 'social', 6);
      
          // Call success callback
          onSuccess?.(user);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
        } catch (error) {
          onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [completeVerification, onSuccess, onError]);

  // Check for Discord callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state === 'discord_verification') {
      handleDiscordCallback(code);
    }
  }, [handleDiscordCallback]);

  const handleDiscordLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

        if (!clientId) {
          onError?.('Discord Client ID not configured');
          return;
        }

    // Discord OAuth URL
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard')}&response_type=code&scope=identify%20email&state=discord_verification`;

    // Redirect to Discord OAuth
    window.location.href = discordAuthUrl;
  };

  const isCompleted = isVerificationCompleted('discord');

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm">Discord verification completed</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleDiscordLogin}
      disabled={isLoading}
      className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white border-0"
    >
      <DiscordIcon size={20} className="mr-2" />
      {isLoading ? 'Verifying...' : 'Verify with Discord'}
    </Button>
  );
}
