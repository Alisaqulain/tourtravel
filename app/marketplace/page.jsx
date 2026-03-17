'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MarketplaceHomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const u = d?.user ?? d?.data?.user;
        setUser(u || null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (user?.role === 'admin' || user?.role === 'superadmin') router.replace('/admin');
    else if (user?.role === 'hotel_owner') router.replace('/marketplace/hotel');
    else if (user) router.replace('/marketplace/hotels');
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Hotel Marketplace</h1>
        <p className="text-muted-foreground mb-2">Book hotels or list your property. For flights, tours & packages use the main site.</p>
        <p className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="text-primary underline">Go to main site</Link>
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/marketplace/hotels">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <User className="h-10 w-10 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Book hotels</h3>
              <p className="text-sm text-muted-foreground mt-1">Search & book as guest</p>
            </Card>
          </Link>
          <Link href="/marketplace/hotel/register">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <Building2 className="h-10 w-10 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Hotel owner</h3>
              <p className="text-sm text-muted-foreground mt-1">Register your hotel</p>
            </Card>
          </Link>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline">Login</Link>
          {' or '}
          <Link href="/marketplace/register" className="text-primary underline">Register</Link>
          {' (customer / hotel owner only)'}
        </p>
      </div>
    </div>
  );
}
