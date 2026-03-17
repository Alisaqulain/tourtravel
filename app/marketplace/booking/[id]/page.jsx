'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Script from 'next/script';

export default function BookingPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [booking, setBooking] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (!d?.user && !d?.data?.user) {
          router.replace('/login?from=/marketplace/booking/' + id);
          return;
        }
        setOrder({ bookingId: id });
        setLoading(false);
      });
  }, [id, router]);

  const createOrder = async () => {
    setPayLoading(true);
    try {
      const res = await fetch('/api/marketplace/bookings/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingId: id }),
      });
      const data = await res.json();
      if (data?.success && data?.data?.orderId) {
        setOrder({ ...data.data, bookingId: id });
        if (typeof window !== 'undefined' && window.Razorpay) {
          openRazorpay(data.data);
        }
      }
    } finally {
      setPayLoading(false);
    }
  };

  const openRazorpay = (opt) => {
    const options = {
      key: opt.key,
      amount: opt.amount,
      currency: opt.currency || 'INR',
      name: 'Hotel Booking',
      order_id: opt.orderId,
      handler: async function (response) {
        const verifyRes = await fetch('/api/marketplace/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: id,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData?.success) router.push('/marketplace/hotels?paid=1');
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <p className="p-8 text-muted-foreground">Loading...</p>;

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <Card className="p-6">
        <h1 className="text-xl font-bold mb-4">Complete Payment</h1>
        <p className="text-muted-foreground mb-6">Booking ID: {id}</p>
        <Button className="w-full" onClick={createOrder} disabled={payLoading}>
          {payLoading ? 'Preparing...' : 'Pay with Razorpay'}
        </Button>
        <p className="text-xs text-muted-foreground mt-4">You will be redirected to Razorpay to complete the payment.</p>
      </Card>
    </div>
  );
}
