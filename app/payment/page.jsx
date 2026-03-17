'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, CreditCard, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useAuthStore } from '@/store';
import { toast } from '@/lib/toast';

function getBookingFromStore(store) {
  const s = store;
  let type = '';
  let item = {};
  let subtotal = 0;

  if (s.selectedFlight) {
    type = 'Flight';
    item = {
      from: s.selectedFlight.from,
      to: s.selectedFlight.to,
      airline: s.selectedFlight.airline,
      departure: s.selectedFlight.departure,
      arrival: s.selectedFlight.arrival,
      date: s.selectedFlight.date,
      price: s.selectedFlight.price,
    };
    subtotal = s.selectedFlight.price || 0;
  } else if (s.selectedHotel) {
    type = 'Hotel';
    const nights = s.selectedHotel.nights || 1;
    item = {
      name: s.selectedHotel.name,
      location: s.selectedHotel.location,
      pricePerNight: s.selectedHotel.pricePerNight,
      nights,
    };
    subtotal = (s.selectedHotel.pricePerNight || 0) * nights;
  } else if (s.selectedTour) {
    type = 'Tour';
    item = { title: s.selectedTour.title, destination: s.selectedTour.destination, duration: s.selectedTour.duration, price: s.selectedTour.price };
    subtotal = s.selectedTour.price || 0;
  } else if (s.selectedPackage) {
    type = 'Package';
    item = { title: s.selectedPackage.title, duration: s.selectedPackage.duration, price: s.selectedPackage.price };
    subtotal = s.selectedPackage.price || 0;
  } else if (s.selectedBus) {
    type = 'Bus';
    item = { from: s.selectedBus.from, to: s.selectedBus.to, operator: s.selectedBus.operator, duration: s.selectedBus.duration, price: s.selectedBus.price };
    subtotal = s.selectedBus.price || 0;
  } else if (s.selectedTrain) {
    type = 'Train';
    item = { name: s.selectedTrain.name, from: s.selectedTrain.from, to: s.selectedTrain.to, duration: s.selectedTrain.duration, class: s.selectedTrain.class, price: s.selectedTrain.price };
    subtotal = s.selectedTrain.price || 0;
  } else if (s.selectedCruise) {
    type = 'Cruise';
    item = { name: s.selectedCruise.name, ship: s.selectedCruise.ship, duration: s.selectedCruise.duration, price: s.selectedCruise.price };
    subtotal = s.selectedCruise.price || 0;
  } else if (s.selectedCar) {
    type = 'Car';
    const days = s.selectedCar.days || 1;
    item = { name: s.selectedCar.name, location: s.selectedCar.location, category: s.selectedCar.category, pricePerDay: s.selectedCar.pricePerDay, days };
    subtotal = (s.selectedCar.pricePerDay || 0) * days;
  }

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  return { type, item, subtotal, tax, total, currency: 'INR' };
}

export default function PaymentPage() {
  const router = useRouter();
  const store = useBookingStore();
  const { user, isLoggedIn } = useAuthStore();
  const bookingPayload = getBookingFromStore(store);
  const hasBooking = !!bookingPayload.type;
  const { subtotal, tax, total } = bookingPayload;
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn && hasBooking) {
      router.replace('/login?redirect=/payment');
    }
  }, [isLoggedIn, hasBooking, router]);

  const openRazorpayCheckout = useCallback(
    async (orderData) => {
      if (!orderData.key || !orderData.orderId) {
        toast.error('Payment not configured. Please contact support.');
        setProcessing(false);
        return;
      }
      if (typeof window === 'undefined' || !window.Razorpay) {
        toast.error('Payment gateway still loading. Wait a few seconds and try again.');
        setProcessing(false);
        return;
      }
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Trips To Travels',
        description: 'Booking payment',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: orderData.bookingId,
              }),
            });
            const data = await verifyRes.json();
            if (data?.success) {
              useBookingStore.getState().clearSelection();
              router.push(`/payment-success?bookingId=${encodeURIComponent(orderData.bookingId)}`);
            } else {
              toast.error(data?.message || 'Verification failed');
              router.push(`/payment-failure?reason=${encodeURIComponent(data?.message || 'Verification failed')}`);
            }
          } catch (err) {
            toast.error('Verification failed');
            router.push('/payment-failure?reason=Verification+failed');
          } finally {
            setProcessing(false);
          }
        },
        modal: { ondismiss: function () {
          setProcessing(false);
          router.push('/payment-failure?reason=Payment+cancelled');
        } },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    [router]
  );

  const handleProceedToPay = async (e) => {
    e.preventDefault();
    if (!hasBooking || !isLoggedIn) return;
    setProcessing(true);
    try {
      const createBookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bookingPayload),
      });
      const bookingJson = await createBookingRes.json();
      if (!bookingJson?.success || !bookingJson?.data?.booking?.bookingId) {
        toast.error(bookingJson?.message || 'Failed to create booking');
        setProcessing(false);
        return;
      }
      const bookingId = bookingJson.data.booking.bookingId;

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingId }),
      });
      const orderJson = await orderRes.json();
      if (!orderJson?.success || !orderJson?.data?.orderId) {
        toast.error(orderJson?.message || 'Failed to create payment order');
        setProcessing(false);
        return;
      }

      await openRazorpayCheckout({
        orderId: orderJson.data.orderId,
        amount: orderJson.data.amount,
        currency: orderJson.data.currency,
        key: orderJson.data.key,
        bookingId,
      });
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
      setProcessing(false);
    }
  };

  if (!hasBooking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <Card className="p-8 text-center max-w-md mx-auto rounded-xl">
          <p className="text-foreground/80 mb-6">No booking selected. Please select a flight, hotel, tour, or package first.</p>
          <Link href="/flights"><Button className="rounded-xl">Browse</Button></Link>
        </Card>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[40vh]">
        <p className="text-foreground/80">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          if (typeof window !== 'undefined' && !window.Razorpay) {
            const s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.async = true;
            s.onload = () => setRazorpayLoaded(true);
            document.body.appendChild(s);
          }
        }}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/booking-summary" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to summary
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Secure Payment</h1>
        <p className="text-foreground/80 mb-8">Pay securely via Razorpay. Card, UPI, Net Banking supported.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Razorpay Checkout</h3>
                  <p className="text-sm text-foreground/70">You will be redirected to a secure payment page.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80 pt-2 mb-6">
                <Shield className="h-4 w-4 text-primary shrink-0" />
                <span>Secured by Razorpay. Your payment details are encrypted.</span>
              </div>
              <Button
                type="button"
                className="w-full rounded-xl"
                size="lg"
                disabled={processing}
                onClick={handleProceedToPay}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing…
                  </>
                ) : (
                  `Pay ${formatPrice(total)}`
                )}
              </Button>
            </Card>
          </div>

          <div>
            <Card className="p-6 sticky top-24 rounded-xl">
              <h3 className="font-semibold mb-4">Order summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Taxes & fees (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>
              <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
