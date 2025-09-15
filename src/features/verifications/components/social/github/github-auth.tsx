"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { GitHubIcon } from '@/shared/components/icons/social-icons';
import { useVerificationStore } from '../../../store/verification-store';

interface GitHubAuthProps {
  onSuccess?: (user: unknown) => void;
  onError?: (error: unknown) => void;
}


export function GitHubAuth({ onSuccess, onError }: GitHubAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { completeVerification, isVerificationCompleted } = useVerificationStore();


  const handleGitHubCallback = async (code: string) => {
    setIsLoading(true);
    
    try {
      // Call the API endpoint instead of direct import
      const response = await fetch('/verifications/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to authenticate with GitHub');
      }

      const data = await response.json();
      const user = data.user;

      // Complete the verification
      completeVerification('github', 'social', 6);
      
          // Call success callback
          onSuccess?.(user);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
        } catch (error) {
          onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for GitHub callback on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state === 'github_verification') {
      handleGitHubCallback(code);
    }
  }, [handleGitHubCallback]);

      const handleGitHubLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        
        if (!clientId) {
          onError?.('GitHub Client ID not configured');
          return;
        }

        // GitHub OAuth URL
        const redirectUri = window.location.origin + '/dashboard';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=github_verification`;
        
        // Redirect to GitHub OAuth
        window.location.href = githubAuthUrl;
      };

  const isCompleted = isVerificationCompleted('github');

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm">GitHub verification completed</span>
      </div>
    );
  }

  return (
        <Button
          onClick={handleGitHubLogin}
      disabled={isLoading}
      className="w-full bg-gray-900 hover:bg-gray-800 text-white border border-gray-700"
    >
      <GitHubIcon size={20} className="mr-2" />
      {isLoading ? 'Verifying...' : 'Verify with GitHub'}
    </Button>
  );
}