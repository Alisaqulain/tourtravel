'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Calendar, Wallet, Percent, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/marketplace/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/marketplace/admin/hotels', label: 'Hotels', icon: Building2 },
  { href: '/marketplace/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/marketplace/admin/payouts', label: 'Payouts', icon: Wallet },
  { href: '/marketplace/admin/commission', label: 'Commission', icon: Percent },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 border-r bg-card p-4 flex flex-col">
        <Link href="/marketplace/admin" className="font-bold text-lg mb-6">Marketplace Admin</Link>
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
