'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, DoorOpen, Calendar, Wallet, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/marketplace/hotel', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/marketplace/hotel/details', label: 'Hotel', icon: Building2 },
  { href: '/marketplace/hotel/rooms', label: 'Rooms', icon: DoorOpen },
  { href: '/marketplace/hotel/bookings', label: 'Bookings', icon: Calendar },
  { href: '/marketplace/hotel/wallet', label: 'Wallet', icon: Wallet },
];

export default function HotelLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 border-r bg-card p-4 flex flex-col">
        <Link href="/marketplace/hotel" className="font-bold text-lg mb-6">Hotel Dashboard</Link>
        <nav className="space-y-1 flex-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium',
                pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/marketplace" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" /> Back
        </Link>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
