'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building2, LayoutDashboard, Wallet, Calendar, Settings, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MarketplaceLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
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
    const isAdmin = pathname?.startsWith('/marketplace/admin');
    const isHotel = pathname?.startsWith('/marketplace/hotel');
    if (isAdmin && user?.role !== 'admin' && user?.role !== 'superadmin') {
      router.replace('/marketplace');
      return;
    }
    if (isHotel && user?.role !== 'hotel_owner') {
      router.replace('/marketplace');
      return;
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
