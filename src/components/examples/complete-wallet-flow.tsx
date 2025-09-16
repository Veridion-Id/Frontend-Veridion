"use client";

import { useState } from "react";
import { ConnectWallet } from "@/features/wallet/components/ConnectWallet";
import { WalletRegistrationWrapper } from "@/components/wallet/wallet-registration-wrapper";
import { WalletDebug } from "@/components/debug/wallet-debug";

export function CompleteWalletFlow() {
  const [user, setUser] = useState<unknown>(null);

  const handleUserReady = (userData: unknown) => {
    setUser(userData);
    console.log("Usuario listo en el flujo completo:", userData);
  };

  return (
    <WalletRegistrationWrapper onUserReady={handleUserReady}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Veridion - Verificación de Humanidad
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Conecta tu wallet para comenzar el proceso de verificación
          </p>
        </div>

        <div className="flex justify-center">
          <ConnectWallet />
        </div>

        {/* Debug info - solo mostrar en desarrollo */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8">
            <WalletDebug />
          </div>
        )}

        {user && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              ¡Usuario Verificado!
            </h3>
            <p className="text-green-700">
              Tu wallet ha sido verificada y registrada exitosamente. Serás
              redirigido al dashboard en breve...
            </p>
          </div>
        )}
      </div>
    </WalletRegistrationWrapper>
  );
}
