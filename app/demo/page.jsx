'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Home, ExternalLink } from 'lucide-react';

export default function DemoPage() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    setMounted(true);
    const t = new Date();
    setTime(t.toISOString());
    const id = setInterval(() => setTime(new Date().toISOString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-2xl border-2 border-border bg-card p-8 shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Deployment successful</h1>
        <p className="text-foreground/80 mb-6">
         Your site is live. Use this page to confirm deployment after each release.
        </p>
        {mounted && (
          <p className="text-sm text-muted-foreground font-mono mb-6 truncate" title={time}>
            {time}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
          <a
            href="/flights"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-6 py-3 font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Flights
          </a>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Trips To Travels · Demo check page
      </p>
    </div>
  );
}
