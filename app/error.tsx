"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4 text-center">
      <div className="rounded-full bg-destructive/10 p-6 ring-1 ring-destructive/20">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <div className="max-w-[500px] space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Something went wrong!
        </h1>
        <p className="text-lg text-muted-foreground">
          We encountered an unexpected error. Our team has been notified.
        </p>
        <div className="mt-4 rounded-md bg-muted p-4 font-mono text-sm text-muted-foreground">
          {error.message || "Unknown error occurred"}
        </div>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" size="lg" asChild className="gap-2">
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
