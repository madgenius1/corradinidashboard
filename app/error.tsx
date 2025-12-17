"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-danger">!</span>
          </div>
          
          <h1 className="text-2xl font-bold text-dark mb-2">
            Something went wrong
          </h1>
          
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. This has been logged and we'll look into it.
          </p>
          
          {error.message && (
            <div className="bg-gray-50 rounded p-3 mb-6 text-left">
              <p className="text-sm text-gray-700 font-mono wrap-break-word">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            <Button onClick={reset}>
              Try Again
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
            >
              Go Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}