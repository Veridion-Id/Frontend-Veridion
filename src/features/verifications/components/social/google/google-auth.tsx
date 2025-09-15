"use client";

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/shared/ui/button';
import { GoogleIcon } from '@/shared/components/icons/social-icons';
import { useVerificationStore } from '../../../store/verification-store';

interface GoogleAuthProps {
  onSuccess?: (user: unknown) => void;
  onError?: (error: unknown) => void;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, config: { theme: string; size: string; text: string; width: string; locale?: string }) => void;
        };
      };
    };
  }
}

export function GoogleAuth({ onSuccess, onError }: GoogleAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { completeVerification, isVerificationCompleted } = useVerificationStore();

  const handleCredentialResponse = useCallback((response: { credential: string }) => {
    setIsLoading(true);
    
    try {
      // Import the Google API function dynamically
      import('./google-api').then(({ decodeGoogleJWT }) => {
        const payload = decodeGoogleJWT(response.credential);
        
        // Complete the verification
        completeVerification('google', 'social', 6);
        
        // Call success callback
        onSuccess?.(payload);
        console.log('Google authentication successful:', payload);
      });
    } catch (error) {
      console.error('Google authentication error:', error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [completeVerification, onSuccess, onError]);

  useEffect(() => {
    console.log('Loading Google Identity Services...');
    
    // Force English locale BEFORE loading the script
    const meta = document.createElement('meta');
    meta.name = 'google-signin-locale';
    meta.content = 'en';
    document.head.appendChild(meta);
    
    // Also set the language attribute on the script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client?hl=en';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('Google script loaded successfully');
      if (window.google) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        console.log('Google Client ID:', clientId);
        console.log('Current origin:', window.location.origin);
        
        try {
          window.google.accounts.id.initialize({
            client_id: clientId || 'your-google-client-id',
            callback: handleCredentialResponse,
          });
          console.log('Google initialized successfully');
          setIsGoogleLoaded(true);
          
          // Render the Google button with a longer delay to ensure English locale
          setTimeout(() => {
            const buttonContainer = document.getElementById('google-signin-button');
            if (buttonContainer) {
              // Clear any existing content
              buttonContainer.innerHTML = '';
              
              window.google.accounts.id.renderButton(buttonContainer, {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                width: '300',
                locale: 'en'
              });
              
              // Add custom styling to make the button more rounded
              setTimeout(() => {
                const googleButton = buttonContainer.querySelector('div[role="button"]');
                if (googleButton) {
                  (googleButton as HTMLElement).style.borderRadius = '9999px';
                }
              }, 100);
              
              console.log('Google button rendered');
            }
          }, 200);
        } catch (error) {
          console.error('Error initializing Google:', error);
        }
      } else {
        console.error('window.google not available after script load');
      }
    };

    script.onerror = (error) => {
      console.error('Error loading Google script:', error);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // Remove the meta tag
      const existingMeta = document.querySelector('meta[name="google-signin-locale"]');
      if (existingMeta) {
        document.head.removeChild(existingMeta);
      }
    };
  }, [handleCredentialResponse]);


  const isCompleted = isVerificationCompleted('google');

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm">Google verification completed</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <Button
          disabled
          className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 rounded-full"
        >
          <GoogleIcon size={20} className="mr-2" />
          Verifying...
        </Button>
      ) : isGoogleLoaded ? (
        <div id="google-signin-button" className="w-full flex justify-center min-h-[48px]"></div>
      ) : (
        <Button
          disabled
          className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 rounded-full"
        >
          <GoogleIcon size={20} className="mr-2" />
          Loading Google...
        </Button>
      )}
    </div>
  );
}
