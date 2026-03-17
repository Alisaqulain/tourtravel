'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Users, Check, X, ArrowLeft, Loader2, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { toast } from '@/lib/toast';

export default function CharDhamPackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params?.packageId;
  const { user, isLoggedIn } = useAuthStore();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    seats: 1,
    travelDate: '',
    specialRequest: '',
  });

  useEffect(() => {
    if (!packageId) return;
    fetch(`/api/chardham/packages/${packageId}`)
      .then((r) => r.json())
      .then((d) => setPkg(d?.data?.package ?? null))
      .finally(() => setLoading(false));
  }, [packageId]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: user.name || f.fullName,
        email: user.email || f.email,
        phone: user.phone || f.phone,
      }));
    }
  }, [user]);

  const openRazorpay = useCallback(
    async (orderData, bookingMongoId) => {
      console.log('[CharDham][PayNow] openRazorpay called', {
        hasRazorpay: typeof window !== 'undefined' ? !!window.Razorpay : false,
        orderData,
        bookingMongoId,
      });
      if (!orderData.key || !orderData.orderId) {
        toast.error('Payment not configured. Please contact support.');
        setProcessing(false);
        return;
      }
      if (typeof window === 'undefined' || !window.Razorpay) {
        toast.error('Payment gateway still loading. Wait a few seconds and click Pay Now again.');
        setProcessing(false);
        return;
      }
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Char Dham Yatra',
        description: 'Package booking payment',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            console.log('[CharDham][PayNow] Razorpay handler response', response);
            const verifyRes = await fetch('/api/chardham/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                id: bookingMongoId,
              }),
            });
            console.log('[CharDham][PayNow] verifyRes status', verifyRes.status);
            const data = await verifyRes.json();
            console.log('[CharDham][PayNow] verifyRes data', data);
            if (data?.success) {
              setBookingOpen(false);
              toast.success('Booking confirmed!');
              router.push('/my-bookings?chardham=1');
            } else {
              toast.error(data?.message || 'Verification failed');
            }
          } catch (err) {
            toast.error('Verification failed');
            console.error('[CharDham][PayNow] verification error', err);
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              console.log('[CharDham][PayNow] Razorpay dismissed - restoring seats/cancel booking', {
                bookingMongoId,
              });
              // If user cuts the payment, we must restore seats and cancel the booking.
              await fetch(`/api/chardham/bookings/${bookingMongoId}/cancel`, {
                method: 'POST',
                credentials: 'include',
              });
            } catch (e) {
              // Non-blocking: user already cancelled payment.
              console.error('CharDham cancel call failed:', e?.message || e);
            } finally {
              setProcessing(false);
              toast.error('Payment cancelled');
            }
          },
        },
      };
      console.log('[CharDham][PayNow] creating Razorpay instance...');
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.error('[CharDham][PayNow] payment.failed', resp);
        const desc =
          resp?.error?.description ||
          resp?.error?.reason ||
          resp?.error?.code ||
          'Payment failed';
        toast.error(String(desc));
        setProcessing(false);
      });
      rzp.open();
    },
    [router]
  );

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!pkg || pkg.seatsAvailable < form.seats) {
      toast.error('Not enough seats available');
      return;
    }
    setProcessing(true);
    let createdBookingId = null;
    try {
      console.log('[CharDham][PayNow] Creating booking...', {
        packageId: pkg.id ?? pkg._id,
        seats: Number(form.seats) || 1,
        travelDate: form.travelDate,
      });
      const bookRes = await fetch('/api/chardham/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          packageId: pkg.id ?? pkg._id,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          seats: Number(form.seats) || 1,
          travelDate: form.travelDate,
          specialRequest: form.specialRequest || undefined,
        }),
      });
      const bookData = await bookRes.json();
      console.log('[CharDham][PayNow] bookingRes', bookRes.status, bookData);
      if (!bookData?.success || !bookData?.data?.booking?.id) {
        toast.error(bookData?.message || 'Failed to create booking');
        setProcessing(false);
        return;
      }
      const bookingId = bookData.data.booking.id;
      createdBookingId = bookingId;

      console.log('[CharDham][PayNow] Creating payment order...', { bookingId });
      const orderRes = await fetch('/api/chardham/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: bookingId }),
      });
      const orderData = await orderRes.json();
      console.log('[CharDham][PayNow] orderRes', orderRes.status, orderData);
      if (!orderData?.success || !orderData?.data?.orderId) {
        toast.error(orderData?.message || 'Failed to create payment order');
        setProcessing(false);
        return;
      }

      await openRazorpay(
        {
          orderId: orderData.data.orderId,
          amount: orderData.data.amount,
          currency: orderData.data.currency,
          key: orderData.data.key,
        },
        bookingId
      );
    } catch (err) {
      console.error(err);
      if (createdBookingId) {
        try {
          console.log('[CharDham][PayNow] handleBookingSubmit catch - cancelling booking', {
            bookingId: createdBookingId,
          });
          await fetch(`/api/chardham/bookings/${createdBookingId}/cancel`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch (_) {}
      }
      toast.error('Something went wrong');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!pkg) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">Package not found.</p>
        <Link href="/chardham-yatra"><Button>Back to packages</Button></Link>
      </div>
    );
  }

  const heroImage = pkg.images?.[0];
  const gallery = pkg.images?.length > 1 ? pkg.images.slice(1) : [];

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          // Fallback: inject script manually (helps when Next Script is blocked on some hosts)
          if (typeof window !== 'undefined' && !window.Razorpay) {
            const s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.async = true;
            s.onload = () => setRazorpayLoaded(true);
            document.body.appendChild(s);
          }
        }}
      />
      <main className="min-h-screen bg-background pb-16">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/chardham-yatra"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to packages
          </Link>

          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 mb-8 bg-muted">
            {heroImage ? (
              <img src={heroImage} alt={pkg.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <MapPin className="h-16 w-16" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="capitalize rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                {pkg.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mt-2">{pkg.name}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-white/90 text-sm">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {pkg.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {pkg.seatsAvailable} seats left</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {pkg.fullDescription || pkg.shortDescription || 'No description.'}
                </p>
              </Card>

              {pkg.itinerary?.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Day-wise Itinerary</h2>
                  <ul className="space-y-3">
                    {pkg.itinerary.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-semibold text-primary shrink-0">Day {item.day}</span>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {(pkg.included?.length > 0 || pkg.excluded?.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-6">
                  {pkg.included?.length > 0 && (
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" /> Included
                      </h2>
                      <ul className="space-y-2 text-muted-foreground">
                        {pkg.included.map((s, i) => (
                          <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600 shrink-0" /> {s}</li>
                        ))}
                      </ul>
                    </Card>
                  )}
                  {pkg.excluded?.length > 0 && (
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <X className="h-5 w-5 text-muted-foreground" /> Excluded
                      </h2>
                      <ul className="space-y-2 text-muted-foreground">
                        {pkg.excluded.map((s, i) => (
                          <li key={i} className="flex items-center gap-2"><X className="h-4 w-4 shrink-0" /> {s}</li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              )}

              {gallery.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.map((src, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div>
              <Card className="p-6 sticky top-24">
                <p className="text-2xl font-bold text-primary mb-2">{formatPrice(pkg.price)}</p>
                <p className="text-sm text-muted-foreground mb-4">per person</p>
                {pkg.seatsAvailable <= 5 && pkg.seatsAvailable > 0 && (
                  <p className="text-amber-600 text-sm font-medium mb-4">Only {pkg.seatsAvailable} seats left</p>
                )}
                {pkg.seatsAvailable === 0 && (
                  <p className="text-destructive text-sm font-medium mb-4">Sold out</p>
                )}
                <Button
                  className="w-full gap-2"
                  size="lg"
                  disabled={pkg.seatsAvailable === 0}
                  onClick={() => {
                    if (!isLoggedIn) {
                      router.push(`/login?redirect=${encodeURIComponent(`/chardham-yatra/${pkg.id ?? pkg._id}`)}`);
                      return;
                    }
                    setBookingOpen(true);
                  }}
                >
                  Book Now <ChevronRight className="h-4 w-4" />
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book {pkg.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                required
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                placeholder="email@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
                placeholder="10-digit mobile"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="seats">Number of Seats</Label>
              <Input
                id="seats"
                type="number"
                min={1}
                max={pkg.seatsAvailable}
                value={form.seats}
                onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="travelDate">Travel Date</Label>
              <Input
                id="travelDate"
                type="date"
                value={form.travelDate}
                onChange={(e) => setForm((f) => ({ ...f, travelDate: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="specialRequest">Special Request (optional)</Label>
              <textarea
                id="specialRequest"
                value={form.specialRequest}
                onChange={(e) => setForm((f) => ({ ...f, specialRequest: e.target.value }))}
                placeholder="Diet, accessibility, etc."
                rows={2}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {formatPrice((pkg.price || 0) * (Number(form.seats) || 1))}
            </p>
            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing…</> : 'Pay Now'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
