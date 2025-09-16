"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { firebaseUserService } from "@/services/firebase-user.service";

export function FirebaseConnectionTest() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult("Testing Firebase connection...");

    try {
      // Test with a dummy wallet address
      const testWallet =
        "GDUKMGUGDZQK6YHYA5Z6AY2G4XDSZPSZ3SW5UN3ARVMO6QSRDWP5YLEX";

      const result = await firebaseUserService.checkUserExists(testWallet);

      if (result.success) {
        setTestResult(
          `✅ Firebase connection successful! User exists: ${result.data}`
        );
      } else {
        if (result.code === "FIREBASE_PERMISSIONS_ERROR") {
          setTestResult(`❌ Firebase permissions error: ${result.error}`);
        } else {
          setTestResult(`⚠️ Firebase connection issue: ${result.error}`);
        }
      }
    } catch (error) {
      setTestResult(
        `❌ Connection failed: ${
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
        <h3 className="text-lg font-semibold">Firebase Connection Test</h3>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Test the Firebase connection and permissions with your new
            credentials.
          </p>

          <Button
            onClick={testConnection}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Firebase Connection"}
          </Button>
        </div>

        {testResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Project ID:</strong> veridion-dd080
          </p>
          <p>
            <strong>Auth Domain:</strong> veridion-dd080.firebaseapp.com
          </p>
        </div>
      </div>
    </Card>
  );
}
