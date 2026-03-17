'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Standard</span><span className="font-semibold">₹35,000</span></li>
            <li className="flex justify-between"><span>Premium</span><span className="font-semibold">₹65,000</span></li>
            <li className="flex justify-between"><span>Luxury (Helicopter Ride)</span><span className="font-semibold">₹1,50,000</span></li>
          </ul>
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
