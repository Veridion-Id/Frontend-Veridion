"use client";

import { useWallet } from "@/features/wallet/hooks/useWallet";
import { useWalletRegistration } from "@/hooks/use-wallet-registration";
import { ConnectWallet } from "@/features/wallet/components/ConnectWallet";
import { FirebaseConnectionTest } from "./firebase-connection-test";
import { StellarRegistrationTest } from "./stellar-registration-test";

export function WalletDebug() {
  const { publicKey, isConnected, walletName } = useWallet();
  const { isLoading, user, isRegistered, showRegistrationModal, error } =
    useWalletRegistration();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Debug Wallet</h2>

      <div className="space-y-2">
        <p>
          <strong>Conectado:</strong> {isConnected ? "Sí" : "No"}
        </p>
        <p>
          <strong>Public Key:</strong> {publicKey || "No conectado"}
        </p>
        <p>
          <strong>Wallet Name:</strong> {walletName || "No disponible"}
        </p>
        <p>
          <strong>Loading:</strong> {isLoading ? "Sí" : "No"}
        </p>
        <p>
          <strong>Registrado:</strong> {isRegistered ? "Sí" : "No"}
        </p>
        <p>
          <strong>Mostrar Modal:</strong> {showRegistrationModal ? "Sí" : "No"}
        </p>
        {error && (
          <p>
            <strong>Error:</strong> {error}
          </p>
        )}
        {user && (
          <div>
            <p>
              <strong>Usuario:</strong>
            </p>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <ConnectWallet />

      <div className="mt-8 space-y-6">
        <FirebaseConnectionTest />
        <StellarRegistrationTest />
      </div>
    </div>
  );
}
