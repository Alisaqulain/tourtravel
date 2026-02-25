'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-foreground/70 mb-8">
          An error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="rounded-xl gap-2" onClick={() => reset()}>
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
          <Link href="/">
            <Button variant="outline" className="rounded-xl gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
