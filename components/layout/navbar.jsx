'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';

const navLinks = [
  { href: '/flights', label: 'Flights' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/tours', label: 'Tours' },
  { href: '/visa', label: 'Visa' },
  { href: '/packages', label: 'Packages' },
  { href: '/offers', label: 'Offers' },
];

export function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-28 md:h-32 lg:h-36 xl:h-40 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center shrink-0 rounded-xl bg-black px-3 py-2 dark:bg-transparent dark:px-0 dark:py-0">
          <Image
            src="/images/logo.png"
            alt="Trips To Travels - Creating unforgettable memories"
            width={520}
            height={136}
            className="h-20 w-auto sm:h-24 md:h-28 lg:h-32 xl:h-36 object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted',
                pathname === link.href ? 'text-primary bg-primary/10' : 'text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link href="/my-bookings">
                <Button variant="ghost" size="sm" className="gap-2 rounded-xl hidden sm:flex">
                  <CalendarCheck className="h-4 w-4" />
                  My Bookings
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2 rounded-xl hidden sm:flex">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="gap-2 rounded-xl hidden sm:flex">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="rounded-xl">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-xl hidden sm:flex">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
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
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === link.href ? 'text-primary bg-primary/10' : 'hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                {isLoggedIn ? (
                  <>
                    <Link href="/my-bookings" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl">
                        <CalendarCheck className="h-4 w-4" /> My Bookings
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl">
                        <User className="h-4 w-4" /> Profile
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-xl" onClick={() => { logout(); setMobileOpen(false); }}>
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full rounded-xl">Login</Button>
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
    </motion.header>
  );
}
