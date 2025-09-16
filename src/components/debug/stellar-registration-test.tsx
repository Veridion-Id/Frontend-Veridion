"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { stellarPassportService } from "@/services/stellar-passport.service";
import { Keypair } from "@stellar/stellar-sdk";

export function StellarRegistrationTest() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testStellarRegistration = async () => {
    setIsLoading(true);
    setTestResult("Testing Stellar Passport registration...");

    try {
      // Create a test keypair
      const testKeypair = Keypair.random();
      const testWallet = testKeypair.publicKey();

      const result = await stellarPassportService.registerUser(
        {
          wallet: testWallet,
          name: "Test",
          surnames: "User",
        },
        testKeypair
      );

      if (result.success) {
        setTestResult(
          `✅ Stellar registration successful! Transaction hash: ${result.transactionHash}`
        );
      } else {
        setTestResult(`❌ Stellar registration failed: ${result.error}`);
      }
    } catch (error) {
      setTestResult(
        `❌ Registration failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Stellar Passport Registration Test
        </h3>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Test the Stellar Passport smart contract registration with a random
            keypair.
          </p>

          <Button
            onClick={testStellarRegistration}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Stellar Registration"}
          </Button>
        </div>

        {testResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Note:</strong> This creates a random keypair for testing
          </p>
          <p>
            <strong>Network:</strong> Testnet
          </p>
        </div>
      </div>
    </Card>
  );
}
