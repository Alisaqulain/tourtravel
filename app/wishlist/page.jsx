'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Plane, Building2, MapPin, Package, Bus, Ship, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonList } from '@/components/ui/skeleton-loader';
import { useAuthStore } from '@/store';

const typeIcons = { flight: Plane, hotel: Building2, tour: MapPin, package: Package, bus: Bus, cruise: Ship, car: Car };

export default function WishlistPage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch('/api/wishlist', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d?.data?.items) setItems(d.data.items);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const remove = async (itemId, type) => {
    await fetch(`/api/wishlist?itemId=${encodeURIComponent(itemId)}&type=${encodeURIComponent(type)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    setItems((prev) => prev.filter((i) => !(i.itemId === itemId && i.type === type)));
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon={Heart}
          title="Sign in to view wishlist"
          description="Save flights, hotels, and more to your wishlist."
          actionLabel="Login"
          actionHref="/login"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8">Items you saved for later.</p>

      {loading ? (
        <SkeletonList count={5} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save flights, hotels, or tours by clicking the heart icon."
          actionLabel="Browse"
          actionHref="/flights"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w, i) => {
            const Icon = typeIcons[w.type] || Heart;
            const snap = w.itemSnapshot || {};
            const title = snap.name || snap.title || snap.from || w.itemId;
            const href = `/${w.type === 'flight' ? 'flights' : w.type === 'hotel' ? 'hotels' : w.type + 's'}/${w.itemId}`;
            return (
              <motion.div
                key={w._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <PremiumCard className="flex flex-row items-center gap-4 p-4" hoverLift={false}>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={href} className="font-medium text-foreground hover:underline truncate block">
                      {title}
                    </Link>
                    <p className="text-xs text-muted-foreground capitalize">{w.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() => remove(w.itemId, w.type)}
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </Button>
                </PremiumCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
