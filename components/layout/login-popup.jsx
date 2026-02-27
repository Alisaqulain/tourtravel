'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { LogIn, UserPlus, Sparkles, Shield, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'trips-login-popup';
const HIDE_FOR_MS = 24 * 60 * 60 * 1000;

const BENEFITS = [
  { icon: Tag, text: 'Exclusive deals & offers' },
  { icon: Shield, text: 'Secure bookings' },
  { icon: Sparkles, text: 'Manage trips in one place' },
];

export function LoginPopup() {
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((s) => !!s.user);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn || pathname !== '/') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === 'never') return;
      const last = raw ? parseInt(raw, 10) : 0;
      if (Date.now() - last < HIDE_FOR_MS) return;
      const t = setTimeout(() => setOpen(true), 1000);
      return () => clearTimeout(t);
    } catch {
      setOpen(true);
    }
  }, [pathname, isLoggedIn]);

  const handleClose = (dontShowAgain) => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, dontShowAgain ? 'never' : String(Date.now()));
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose(false)}>
      <DialogContent
        className="p-0 gap-0 max-w-2xl overflow-hidden rounded-2xl border-0 shadow-2xl"
        showClose={false}
      >
        <div className="flex flex-col sm:flex-row min-h-[420px]">
          {/* Left: visual + benefits */}
          <div className="relative w-full sm:w-[42%] min-h-[200px] sm:min-h-0 bg-gradient-to-br from-primary/90 to-amber-600 flex flex-col justify-end p-6 text-primary-foreground">
            <button
              type="button"
              onClick={() => handleClose(false)}
              className="absolute right-3 top-3 rounded-full p-2 hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative h-32 sm:h-40 w-full mt-auto">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600"
                alt="Travel"
                fill
                className="object-cover object-center opacity-90 rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
            </div>
            <ul className="mt-4 space-y-3">
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={b.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <b.icon className="h-4 w-4 shrink-0" />
                  {b.text}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right: content */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                    Welcome to Trips To Travels
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Sign in or create an account to get the best prices and manage your bookings.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1 rounded-xl h-12 font-semibold" size="lg">
                    <Link href="/login" onClick={() => handleClose(false)}>
                      <LogIn className="h-5 w-5 mr-2" /> Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 rounded-xl h-12 font-semibold border-2 border-primary text-primary hover:bg-primary/10"
                    size="lg"
                  >
                    <Link href="/signup" onClick={() => handleClose(false)}>
                      <UserPlus className="h-5 w-5 mr-2" /> Sign Up
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <button
                    type="button"
                    onClick={() => handleClose(false)}
                    className={cn(
                      'text-sm text-muted-foreground hover:text-foreground w-full text-center py-1',
                      'transition-colors'
                    )}
                  >
                    Maybe later
                  </button>
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-border text-primary focus:ring-primary"
                      onChange={(e) => e.target.checked && handleClose(true)}
                    />
                    <span className="text-xs text-muted-foreground">Don&apos;t show again</span>
                  </label>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
