"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/ui/button';
import { LinkedInIcon } from '@/shared/components/icons/social-icons';
import { useVerificationStore } from '../../../store/verification-store';

interface LinkedInAuthProps {
  onSuccess?: (user: unknown) => void;
  onError?: (error: unknown) => void;
}

export function LinkedInAuth({ onSuccess, onError }: LinkedInAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { completeVerification, isVerificationCompleted } = useVerificationStore();

  console.log('LinkedInAuth component rendered');

  const handleLinkedInCallback = useCallback(async (code: string) => {
    setIsLoading(true);
    
    try {
      // Import the LinkedIn auth function dynamically
      const { authenticateWithLinkedIn } = await import('./linkedin-api');
      
      // Authenticate with LinkedIn
      const user = await authenticateWithLinkedIn(code);

      // Complete the verification
      completeVerification('linkedin', 'social', 6);
      
      // Call success callback
      onSuccess?.(user);
      console.log('LinkedIn authentication successful:', user);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
    } catch (error) {
      console.error('LinkedIn authentication error:', error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [completeVerification, onSuccess, onError]);

  // Check for LinkedIn callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    console.log('LinkedIn callback - Code:', code ? 'Present' : 'Missing');
    console.log('LinkedIn callback - State:', state);
    console.log('LinkedIn callback - Expected state: linkedin_verification');

    if (code && state === 'linkedin_verification') {
      handleLinkedInCallback(code);
    } else if (code && state) {
      console.error('LinkedIn state mismatch:', { received: state, expected: 'linkedin_verification' });
    }
  }, [handleLinkedInCallback]);

  const handleLinkedInLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    
    console.log('LinkedIn Client ID:', clientId);
    console.log('All env vars:', {
      LINKEDIN_CLIENT_ID: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
      DISCORD_CLIENT_ID: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
      GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    });

    if (!clientId) {
      console.error('LinkedIn Client ID not configured');
      onError?.('LinkedIn Client ID not configured');
      return;
    }

    // LinkedIn OAuth URL - Usando solo scope básico
    const redirectUri = 'http://localhost:3000/callback';
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=linkedin_verification`;

    console.log('LinkedIn OAuth URL:', linkedinAuthUrl);
    console.log('Redirect URI:', redirectUri);
    console.log('Client ID in URL:', clientId);
    console.log('State parameter:', 'linkedin_verification');

    // Redirect to LinkedIn OAuth
    window.location.href = linkedinAuthUrl;
  };

  const isCompleted = isVerificationCompleted('linkedin');

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm">LinkedIn verification completed</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleLinkedInLogin}
      disabled={isLoading}
      className="w-full bg-[#0077B5] hover:bg-[#005885] text-white"
    >
      <LinkedInIcon size={20} className="mr-2" />
      {isLoading ? 'Verifying...' : 'Verify with LinkedIn'}
    </Button>
  );
}
