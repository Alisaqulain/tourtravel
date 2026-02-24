'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  LogOut,
  CalendarCheck,
  Home,
  Building2,
  Plane,
  MapPin,
  Bus,
  Train,
  Ship,
  Car,
  FileCheck,
  Package,
  Percent,
  Phone,
  Heart,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { useTheme } from '@/components/theme-provider';
import { NotificationBell } from '@/components/layout/notification-bell';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/hotels', label: 'Hotels', icon: Building2 },
  { href: '/flights', label: 'Flights', icon: Plane },
  { href: '/tours', label: 'Tours', icon: MapPin },
  { href: '/bus', label: 'Bus', icon: Bus },
  { href: '/train', label: 'Train', icon: Train },
  { href: '/cruise', label: 'Cruise', icon: Ship },
  { href: '/cars', label: 'Premium Cars', icon: Car },
  { href: '/visa', label: 'Visa', icon: FileCheck },
  { href: '/packages', label: 'Packages', icon: Package },
  { href: '/offers', label: 'Offers', icon: Percent },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors duration-200',
        'bg-background/95 backdrop-blur-md border-border/60',
        'shadow-sm'
      )}
      role="banner"
    >
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center shrink-0 min-w-0 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Home"
        >
          <Image
            src="/images/Trip%20Logo.png"
            alt="Trips To Travels"
            width={280}
            height={72}
            className="h-9 md:h-10 w-auto object-contain object-left"
            priority
          />
        </Link>

        <nav
          className="hidden md:flex items-center flex-1 justify-center gap-0.5 max-w-4xl mx-auto"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'shrink-0 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'inline-flex items-center gap-1.5 whitespace-nowrap',
                  'hover:bg-muted/80 hover:text-foreground',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  isActive
                    ? 'text-primary bg-primary/10 shadow-sm'
                    : 'text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 md:gap-2 shrink-0">
         
          <NotificationBell />
          {isLoggedIn && (
            <Link href="/wishlist" className="hidden sm:block" aria-label="Wishlist">
              <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link href="/my-bookings" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="gap-2 rounded-lg text-sm">
                  <CalendarCheck className="h-4 w-4" aria-hidden />
                  My Bookings
                </Button>
              </Link>
              <Link href="/profile" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="gap-2 rounded-lg text-sm">
                  <User className="h-4 w-4" aria-hidden />
                  Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2 rounded-lg text-sm hidden sm:flex"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-lg text-sm font-medium text-foreground">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-lg text-sm font-medium">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-lg h-9 w-9"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/60 bg-background"
          >
            <nav
              className="container mx-auto flex flex-col gap-0.5 px-4 py-4 max-h-[70vh] overflow-y-auto text-foreground"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
                      isActive ? 'text-primary bg-primary/10' : 'hover:bg-muted/80'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 hover:bg-muted/80"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
                {isLoggedIn ? (
                  <>
                    <Link href="/my-bookings" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl">
                        <CalendarCheck className="h-4 w-4" /> My Bookings
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl">
                        <User className="h-4 w-4" /> Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 rounded-xl"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full rounded-xl">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full rounded-xl">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
