"use client";

import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

interface FirebasePermissionsErrorProps {
  onRetry?: () => void;
}

export function FirebasePermissionsError({
  onRetry,
}: FirebasePermissionsErrorProps) {
  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="text-red-600">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Firebase Permissions Error
          </h3>
          <p className="text-gray-600 mt-2">
            The application cannot access Firebase Firestore due to insufficient
            permissions.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
          <h4 className="font-medium text-yellow-800 mb-2">
            To fix this issue:
          </h4>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>
              Go to{" "}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Firebase Console
              </a>
            </li>
            <li>
              Select your project:{" "}
              <code className="bg-yellow-100 px-1 rounded">veridion-dd080</code>
            </li>
            <li>Go to Firestore Database → Rules</li>
            <li>
              Replace the rules with the content from{" "}
              <code className="bg-yellow-100 px-1 rounded">
                firestore.rules
              </code>
            </li>
            <li>Click &quot;Publish&quot;</li>
          </ol>
        </div>

        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Retry
            </Button>
          )}
          <Button
            onClick={() =>
              window.open("https://console.firebase.google.com/", "_blank")
            }
            variant="default"
          >
            Open Firebase Console
          </Button>
        </div>
      </div>
    </Card>
  );
}
