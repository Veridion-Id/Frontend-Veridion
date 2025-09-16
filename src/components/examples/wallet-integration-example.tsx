"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ConnectWallet } from "@/features/wallet/components/ConnectWallet";
import { WalletRegistrationWrapper } from "@/components/wallet/wallet-registration-wrapper";
import { firebaseUserService } from "@/services/firebase-user.service";
import { FirebaseUser } from "@/services/firebase-user.service";

export function WalletIntegrationExample() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserReady = (user: FirebaseUser) => {
    setCurrentUser(user);
    console.log("Usuario listo:", user);
  };

  const handleRefreshData = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const result = await firebaseUserService.getUserCompleteInfo(
        currentUser.wallet
      );
      if (result.success && result.data) {
        setCurrentUser(result.data.firebase);
        console.log("Datos actualizados:", result.data);
      }
    } catch (error) {
      console.error("Error actualizando datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateScore = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const result = await firebaseUserService.updateStellarScore(
        currentUser.wallet
      );
      if (result.success) {
        setCurrentUser((prev) =>
          prev ? { ...prev, stellarScore: result.data } : null
        );
        console.log("Score actualizado:", result.data);
      }
    } catch (error) {
      console.error("Error actualizando score:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletRegistrationWrapper onUserReady={handleUserReady}>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            Integración Wallet + Firebase + Smart Contract
          </h2>

          <div className="space-y-4">
            <ConnectWallet />

            {currentUser && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800">
                    Usuario Registrado
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-green-700">
                    <p>
                      <strong>Wallet:</strong> {currentUser.wallet}
                    </p>
                    <p>
                      <strong>Nombre:</strong> {currentUser.name}{" "}
                      {currentUser.surnames}
                    </p>
                    {currentUser.email && (
                      <p>
                        <strong>Email:</strong> {currentUser.email}
                      </p>
                    )}
                    <p>
                      <strong>Score Stellar:</strong>{" "}
                      {currentUser.stellarScore || 0}
                    </p>
                    <p>
                      <strong>Verificaciones:</strong>{" "}
                      {currentUser.verifications?.length || 0}
                    </p>
                    <p>
                      <strong>Registrado en Stellar:</strong>{" "}
                      {currentUser.stellarRegistered ? "Sí" : "No"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleRefreshData}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? "Cargando..." : "Actualizar Datos"}
                  </Button>

                  <Button
                    onClick={handleUpdateScore}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? "Actualizando..." : "Actualizar Score"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">
            Flujo de Funcionamiento
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              1. <strong>Conectar Wallet:</strong> El usuario conecta su wallet
            </p>
            <p>
              2. <strong>Verificar Registro:</strong> Se verifica si el usuario
              existe en Firebase
            </p>
            <p>
              3. <strong>Registro Automático:</strong> Si no existe, se muestra
              el modal de registro
            </p>
            <p>
              4. <strong>Doble Registro:</strong> Se registra tanto en Firebase
              como en el Smart Contract
            </p>
            <p>
              5. <strong>Usuario Listo:</strong> El usuario puede usar la
              aplicación
            </p>
          </div>
        </Card>
      </div>
    </WalletRegistrationWrapper>
  );
}
