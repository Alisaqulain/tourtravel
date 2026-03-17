'use client';

import { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { NotificationBell } from '@/components/layout/notification-bell';

const mainLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/flights', label: 'Flights', icon: Plane },
  { href: '/hotels', label: 'Hotels', icon: Building2 },
];

const transportLinks = [
  { href: '/bus', label: 'Bus', icon: Bus },
  { href: '/train', label: 'Train', icon: Train },
  { href: '/cruise', label: 'Cruise', icon: Ship },
  { href: '/cars', label: 'Premium Cars', icon: Car },
];

const exploreLinks = [
  { href: '/tours', label: 'Tours', icon: MapPin },
  { href: '/packages', label: 'Packages', icon: Package },
];

const moreLinks = [
  { href: '/visa', label: 'Visa', icon: FileCheck },
  { href: '/offers', label: 'Offers', icon: Percent },
  { href: '/contact', label: 'Contact', icon: Phone },
];

function NavLink({ href, label, icon: Icon, isActive, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        'hover:bg-muted/80 hover:text-foreground',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
        isActive ? 'text-primary bg-primary/10' : 'text-foreground'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
      <span>{label}</span>
    </Link>
  );
}

function Dropdown({ id, label, icon: Icon, links, isOpen, onToggle, onClose, onHoverOpen, onHoverClose }) {
  const pathname = usePathname();
  const anyActive = links.some((l) => pathname === l.href);
  return (
    <div
      className="relative"
      onMouseEnter={() => onHoverOpen?.(id)}
      onMouseLeave={onHoverClose}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
          'hover:bg-muted/80 hover:text-foreground',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
          (isOpen || anyActive) ? 'text-primary bg-primary/10' : 'text-foreground'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${label} menu`}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
        <span>{label}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              aria-hidden
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-1 z-50 min-w-[200px] py-1.5 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-xl"
            >
              {links.map((link) => {
                const LIcon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors duration-150',
                      'hover:bg-primary/10 hover:text-primary',
                      active ? 'text-primary bg-primary/10' : 'text-foreground'
                    )}
                  >
                    <LIcon className="h-4 w-4 shrink-0" aria-hidden />
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!openDropdown) return;
    const handle = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [openDropdown]);

  const hoverLeaveRef = useRef(null);
  const toggleDropdown = (id) => setOpenDropdown((v) => (v === id ? null : id));
  const closeDropdown = () => setOpenDropdown(null);
  const openHover = (id) => {
    if (hoverLeaveRef.current) clearTimeout(hoverLeaveRef.current);
    setOpenDropdown(id);
  };
  const closeHover = () => {
    hoverLeaveRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-200',
        'bg-background/98 backdrop-blur-lg',
        'border-b border-border/50'
      )}
      role="banner"
    >
      <div className="container mx-auto flex h-12 md:h-14 items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 min-w-0">
        <Link
          href="/"
          className="flex items-center shrink-0 min-w-0 py-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Home"
        >
          <Image
            src="/images/Trip%20Logo.png"
            alt="Trips To Travels"
            width={280}
            height={72}
            className="h-7 sm:h-8 md:h-9 w-auto max-h-9 object-contain object-left"
            priority
          />
        </Link>

        <nav
          className="hidden lg:flex items-center gap-0.5 flex-1 justify-center max-w-3xl mx-auto min-w-0"
          aria-label="Main navigation"
        >
          {mainLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              isActive={pathname === link.href}
            />
          ))}
          <Dropdown
            id="transport"
            label="Transport"
            icon={Bus}
            links={transportLinks}
            isOpen={openDropdown === 'transport'}
            onToggle={toggleDropdown}
            onClose={closeDropdown}
            onHoverOpen={openHover}
            onHoverClose={closeHover}
          />
          <Dropdown
            id="explore"
            label="Tours & Packages"
            icon={Package}
            links={exploreLinks}
            isOpen={openDropdown === 'explore'}
            onToggle={toggleDropdown}
            onClose={closeDropdown}
            onHoverOpen={openHover}
            onHoverClose={closeHover}
          />
          <Dropdown
            id="more"
            label="More"
            icon={Percent}
            links={moreLinks}
            isOpen={openDropdown === 'more'}
            onToggle={toggleDropdown}
            onClose={closeDropdown}
            onHoverOpen={openHover}
            onHoverClose={closeHover}
          />
        </nav>

        <div className="flex items-center gap-1 md:gap-1.5 shrink-0 min-w-0">
          <NotificationBell />
          {isLoggedIn ? (
            <div className="relative flex items-center gap-0.5">
              <Link href="/wishlist" className="hidden sm:block" aria-label="Wishlist">
                <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
              </Link>
              <div
                className="relative"
                onMouseEnter={() => openHover('account')}
                onMouseLeave={closeHover}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 rounded-lg text-sm h-8 px-2.5"
                  onClick={() => toggleDropdown('account')}
                  aria-expanded={openDropdown === 'account'}
                  aria-haspopup="true"
                  aria-label="Account menu"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[80px] truncate">{user?.name || 'Account'}</span>
                  <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', openDropdown === 'account' && 'rotate-180')} />
                </Button>
                <AnimatePresence>
                  {openDropdown === 'account' && (
                    <>
                      <div className="fixed inset-0 z-40" aria-hidden onClick={closeDropdown} />
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-1 z-50 min-w-[200px] py-1.5 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-xl"
                      >
                        {(user?.role === 'admin' || user?.role === 'superadmin') && (
                          <Link href="/admin" onClick={closeDropdown}>
                            <span className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                              <Shield className="h-4 w-4" /> Admin panel
                            </span>
                          </Link>
                        )}
                        {user?.role === 'hotel_owner' && (
                          <Link href="/hotel" onClick={closeDropdown}>
                            <span className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                              <Building2 className="h-4 w-4" /> Hotel dashboard
                            </span>
                          </Link>
                        )}
                        <Link href="/my-bookings" onClick={closeDropdown}>
                          <span className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                            <CalendarCheck className="h-4 w-4" /> My Bookings
                          </span>
                        </Link>
                        <Link href="/profile" onClick={closeDropdown}>
                          <span className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                            <User className="h-4 w-4" /> Profile
                          </span>
                        </Link>
                        <Link href="/wishlist" onClick={closeDropdown} className="sm:hidden">
                          <span className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                            <Heart className="h-4 w-4" /> Wishlist
                          </span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            closeDropdown();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg text-left transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-lg text-sm h-8 font-medium text-foreground">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-lg text-sm h-8 font-medium">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-lg h-8 w-8"
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
            className="lg:hidden border-t border-border/60 bg-background"
          >
            <nav
              className="container mx-auto flex flex-col gap-0.5 px-4 py-4 max-h-[70vh] overflow-y-auto"
              aria-label="Mobile navigation"
            >
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3',
                    pathname === link.href ? 'text-primary bg-primary/10' : 'hover:bg-muted/80'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <div className="py-2">
                <p className="px-4 py-1 text-xs font-semibold text-foreground/50 uppercase tracking-wider">Transport</p>
                {transportLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm',
                      pathname === link.href ? 'text-primary bg-primary/10' : 'hover:bg-muted/80'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <p className="px-4 py-1 text-xs font-semibold text-foreground/50 uppercase tracking-wider">Tours & Packages</p>
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm',
                      pathname === link.href ? 'text-primary bg-primary/10' : 'hover:bg-muted/80'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <p className="px-4 py-1 text-xs font-semibold text-foreground/50 uppercase tracking-wider">More</p>
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm',
                      pathname === link.href ? 'text-primary bg-primary/10' : 'hover:bg-muted/80'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl">
                          <Shield className="h-4 w-4" /> Admin panel
                        </Button>
                      </Link>
                    )}
                    {user?.role === 'hotel_owner' && (
                      <Link href="/hotel" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl">
                          <Building2 className="h-4 w-4" /> Hotel dashboard
                        </Button>
                      </Link>
                    )}
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
                    <Link href="/wishlist" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl">
                        <Heart className="h-4 w-4" /> Wishlist
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
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
