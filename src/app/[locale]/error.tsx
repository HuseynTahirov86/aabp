"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorPage({
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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold font-serif text-primary mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We apologize for the inconvenience. An unexpected error has occurred while loading this page.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-primary text-white hover:bg-primary/90">
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Return Home
        </Button>
      </div>
    </div>
  );
}
