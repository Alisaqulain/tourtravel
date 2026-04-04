'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const POPUP_DELAY_MS = 3000;
const STORAGE_KEY = 'chardham_offer_popup_seen';

export function CharDhamOfferPopup() {
  const [open, setOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [pricesLoading, setPricesLoading] = useState(true);

  useEffect(() => {
    fetch('/api/chardham/packages')
      .then((r) => r.json())
      .then((d) => setPackages(d?.data?.packages ?? []))
      .finally(() => setPricesLoading(false));
  }, []);

  useEffect(() => {
    const seen = typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;
    const t = setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== 'undefined') sessionStorage.setItem(STORAGE_KEY, '1');
  };

  const byCategory = (cat) => packages.filter((p) => p.category === cat);
  const featured = [
    byCategory('standard')[0],
    byCategory('premium')[0],
    byCategory('luxury')[0],
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(v); }}>
      <DialogContent className="max-w-md rounded-2xl" showClose={false} aria-describedby="chardham-offer-desc">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">
            ✨ Exclusive Char Dham Yatra Offer ✨
          </DialogTitle>
          <DialogDescription id="chardham-offer-desc">
            Limited seats available. Book your pilgrimage with best prices.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-muted-foreground text-sm text-center">
            Limited seats available. Book your pilgrimage with best prices.
          </p>
          {pricesLoading ? (
            <p className="text-muted-foreground text-sm text-center">Loading current prices…</p>
          ) : featured.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {featured.map((pkg) => (
                <li key={pkg.id ?? pkg._id} className="border-b border-border/60 pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between gap-2">
                    <span className="truncate">{pkg.name}</span>
                    <span className="font-semibold shrink-0">{formatPrice(pkg.price)}</span>
                  </div>
                  {pkg.offerText?.trim() && (
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-500 mt-1 pr-1">{pkg.offerText.trim()}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm text-center">
              View Char Dham packages for the latest prices.
            </p>
          )}
          <p className="text-center text-amber-600 font-medium text-sm">Limited Seats Available</p>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link href="/chardham-yatra" className="flex-1" onClick={handleClose}>
              <Button className="w-full rounded-xl">View Packages</Button>
            </Link>
            <Link href="/chardham-yatra" className="flex-1" onClick={handleClose}>
              <Button variant="outline" className="w-full rounded-xl">Book Now</Button>
            </Link>
          </div>
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={handleClose}>
            Close
          </Button>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
