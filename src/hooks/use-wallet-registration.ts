"use client";

import { useState, useCallback } from "react";
import { Keypair } from "@stellar/stellar-sdk";
import { LocalStorageService } from "@/shared/services/local-storage.service";
import { User } from "@/shared/types/user.types";

interface UseWalletRegistrationState {
  isLoading: boolean;
  user: User | null;
  isRegistered: boolean;
  showRegistrationModal: boolean;
  error: string | null;
}

interface UseWalletRegistrationActions {
  checkWalletRegistration: (
    wallet: string,
    signer: Keypair | null,
    walletType?: string
  ) => Promise<void>;
  handleRegistrationSuccess: (user: User) => void;
  closeRegistrationModal: () => void;
  refreshUserData: (wallet: string) => Promise<void>;
  clearError: () => void;
}

export function useWalletRegistration(): UseWalletRegistrationState &
  UseWalletRegistrationActions {
  const [state, setState] = useState<UseWalletRegistrationState>({
    isLoading: false,
    user: null,
    isRegistered: false,
    showRegistrationModal: false,
    error: null,
  });

  const checkWalletRegistration = useCallback(
    async (wallet: string, _signer: Keypair | null, _walletType?: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Check if user exists in localStorage
        const user = LocalStorageService.getUserByWallet(wallet);

        if (user) {
          // User exists
          setState((prev) => ({
            ...prev,
            isLoading: false,
            user: user,
            isRegistered: true,
            showRegistrationModal: false,
          }));
        } else {
          // User doesn't exist, show registration modal
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isRegistered: false,
            showRegistrationModal: true,
            user: null,
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unexpected error",
        }));
      }
    },
    []
  );

  const handleRegistrationSuccess = useCallback((user: User) => {
    setState((prev) => ({
      ...prev,
      user,
      isRegistered: true,
      showRegistrationModal: false,
      error: null,
    }));
  }, []);

  const closeRegistrationModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showRegistrationModal: false,
    }));
  }, []);

  const refreshUserData = useCallback(async (wallet: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = LocalStorageService.getUserByWallet(wallet);

      if (user) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          user: user,
          isRegistered: true,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Error updating user data",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    checkWalletRegistration,
    handleRegistrationSuccess,
    closeRegistrationModal,
    refreshUserData,
    clearError,
  };
}
