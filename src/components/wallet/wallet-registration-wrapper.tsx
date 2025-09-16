"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegistrationModal } from "@/components/modals/registration-modal";
import { useWalletRegistration } from "@/hooks/use-wallet-registration";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { User } from "@/shared/types/user.types";

interface WalletRegistrationWrapperProps {
  children: React.ReactNode;
  onUserReady?: (user: User) => void;
}

export function WalletRegistrationWrapper({
  children,
  onUserReady,
}: WalletRegistrationWrapperProps) {
  const router = useRouter();
  const { publicKey, isConnected, walletName } = useWallet();

  const {
    isLoading,
    user,
    isRegistered,
    showRegistrationModal,
    error,
    checkWalletRegistration,
    handleRegistrationSuccess,
    closeRegistrationModal,
  } = useWalletRegistration();

  // Check registration when wallet connects
  useEffect(() => {
    if (isConnected && publicKey) {
      checkWalletRegistration(publicKey, null, walletName || undefined);
    }
  }, [isConnected, publicKey, walletName, checkWalletRegistration]);

  // Notify when user is ready and navigate to dashboard
  useEffect(() => {
    if (isRegistered && user) {
      if (onUserReady) {
        onUserReady(user);
      }
      router.push("/dashboard");
    }
  }, [isRegistered, user, onUserReady, router]);

  // Show error if any
  useEffect(() => {
    if (error) {
      console.error("Wallet registration error:", error);
    }
  }, [error]);

  return (
    <>
      {children}

      {/* Registration modal */}
      {showRegistrationModal && isConnected && publicKey && (
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={closeRegistrationModal}
          onSuccess={handleRegistrationSuccess}
          wallet={publicKey}
          signer={null} // Only localStorage for now
          walletType={walletName || undefined}
        />
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">
                {isRegistered ? "Loading data..." : "Checking registration..."}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
