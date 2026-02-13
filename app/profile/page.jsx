'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-premium">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
              <p className="text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <dl className="space-y-4">
            <div className="flex items-center gap-3 py-3 border-b border-border">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <dt className="text-sm text-muted-foreground">Full name</dt>
                <dd className="font-medium">{user?.name || 'Demo User'}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3 border-b border-border">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="font-medium">{user?.email || 'demo@example.com'}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <dt className="text-sm text-muted-foreground">Member since</dt>
                <dd className="font-medium">February 2025</dd>
              </div>
            </div>
          </dl>
          <div className="mt-8 flex gap-3">
            <Link href="/booking-summary">
              <Button variant="outline" className="rounded-xl">View Bookings</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
