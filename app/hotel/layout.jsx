'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  DollarSign,
  Calendar,
  CalendarCheck,
  Wallet,
  Star,
  Settings,
  LogOut,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const fullNav = [
  { href: '/hotel', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/hotel/profile', label: 'Hotel Profile', icon: Building2 },
  { href: '/hotel/rooms', label: 'Rooms', icon: DoorOpen },
  { href: '/hotel/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/hotel/availability', label: 'Availability', icon: Calendar },
  { href: '/hotel/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/hotel/wallet', label: 'Wallet', icon: Wallet },
  { href: '/hotel/reviews', label: 'Reviews', icon: Star },
  { href: '/hotel/settings', label: 'Settings', icon: Settings },
];

const underReviewNav = [
  { href: '/hotel', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/hotel/profile', label: 'Hotel Profile', icon: Building2 },
];

export default function HotelPortalLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const isSignup = pathname === '/hotel/signup';

  useEffect(() => {
    if (isSignup) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetch('/api/auth/me', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/marketplace/hotel/register', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([authRes, hotelRes]) => {
        const u = authRes?.user ?? authRes?.data?.user;
        const h = hotelRes?.data?.hotel;
        setUser(u || null);
        setHotel(h || null);
        if (u && (u.role === 'admin' || u.role === 'superadmin')) {
          router.replace('/admin');
          return;
        }
        if (u && u.role !== 'hotel_owner') {
          router.replace('/');
          return;
        }
        if (u && u.role === 'hotel_owner' && !h) {
          router.replace('/hotel/signup');
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [isSignup, router]);

  if (isSignup) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.replace('/hotel/signup');
    return null;
  }
  if (user.role === 'hotel_owner' && !hotel) {
    router.replace('/hotel/signup');
    return null;
  }

  const isApproved = hotel?.status === 'approved';
  const nav = isApproved ? fullNav : underReviewNav;

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <Link href="/hotel" className="font-bold text-lg">
            Hotel Portal
          </Link>
          {hotel && (
            <p className="text-sm text-muted-foreground mt-1 truncate">{hotel.name}</p>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => {
              fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(() =>
                router.replace('/hotel/signup')
              );
            }}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        {!isApproved && hotel && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Your hotel profile is under review by admin.
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Add rooms, bookings, and pricing will be available after approval. You can view and edit your profile below.
              </p>
              {hotel.adminNote && (
                <p className="text-sm mt-1 text-amber-800 dark:text-amber-200">
                  Admin note: {hotel.adminNote}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
