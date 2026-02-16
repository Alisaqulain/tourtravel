'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/store';
import {
  LayoutDashboard,
  Plane,
  Building2,
  MapPin,
  Package,
  LogOut,
  Menu,
  X,
  Users,
  CalendarCheck,
  Bus,
  Ship,
  Car,
  Palette,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/flights', label: 'Flights', icon: Plane },
  { href: '/admin/hotels', label: 'Hotels', icon: Building2 },
  { href: '/admin/tours', label: 'Tours', icon: MapPin },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/theme', label: 'Website Theme', icon: Palette },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, logoutAdmin } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    if (!isAdmin) router.replace('/admin/login');
  }, [isAdmin, pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="text-lg font-bold gradient-text">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                pathname === item.href ? 'bg-primary text-white' : 'hover:bg-muted'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground mb-2">
            ← Back to site
          </Link>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2 rounded-xl" onClick={() => { logoutAdmin(); router.replace('/admin/login'); }}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 border-b border-border bg-card">
        <button type="button" onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-muted">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-bold gradient-text">Admin</span>
        <div className="w-9" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 flex flex-col border-r border-border bg-card transition-transform md:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <span className="font-bold gradient-text">Admin Panel</span>
          <button type="button" onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                pathname === item.href ? 'bg-primary text-white' : 'hover:bg-muted'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground mb-2">
            ← Back to site
          </Link>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2 rounded-xl" onClick={() => { logoutAdmin(); router.replace('/admin/login'); setSidebarOpen(false); }}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 pt-14 md:pt-0 md:min-h-screen">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
