'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Smartphone, Building2, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBookingStore, useAuthStore } from '@/store';

function getTotal(store) {
  let total = 0;
  if (store.selectedFlight) total += store.selectedFlight.price;
  if (store.selectedHotel) total += (store.selectedHotel.pricePerNight || 0) * (store.selectedHotel.nights || 1);
  if (store.selectedTour) total += store.selectedTour.price;
  if (store.selectedPackage) total += store.selectedPackage.price;
  if (store.selectedBus) total += store.selectedBus.price;
  if (store.selectedTrain) total += store.selectedTrain.price;
  if (store.selectedCruise) total += store.selectedCruise.price;
  if (store.selectedCar) total += (store.selectedCar.pricePerDay || 0) * (store.selectedCar.days || 1);
  return total || 0;
}

export default function PaymentPage() {
  const router = useRouter();
  const store = useBookingStore();
  const hasBooking = store.selectedFlight || store.selectedHotel || store.selectedTour || store.selectedPackage || store.selectedBus || store.selectedTrain || store.selectedCruise || store.selectedCar;
  const subtotal = getTotal(store);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    const user = useAuthStore.getState().user;
    const addCompletedBooking = useBookingStore.getState().addCompletedBooking;
    let description = '';
    if (store.selectedFlight) description = `Flight: ${store.selectedFlight.from} → ${store.selectedFlight.to}`;
    else if (store.selectedHotel) description = `Hotel: ${store.selectedHotel.name}`;
    else if (store.selectedTour) description = `Tour: ${store.selectedTour.title}`;
    else if (store.selectedPackage) description = `Package: ${store.selectedPackage.title}`;
    else if (store.selectedBus) description = `Bus: ${store.selectedBus.from} → ${store.selectedBus.to}`;
    else if (store.selectedTrain) description = `Train: ${store.selectedTrain.name} ${store.selectedTrain.from} → ${store.selectedTrain.to}`;
    else if (store.selectedCruise) description = `Cruise: ${store.selectedCruise.name}`;
    else if (store.selectedCar) description = `Car: ${store.selectedCar.name}`;
    addCompletedBooking({
      type: store.selectedFlight ? 'Flight' : store.selectedHotel ? 'Hotel' : store.selectedTour ? 'Tour' : store.selectedPackage ? 'Package' : store.selectedBus ? 'Bus' : store.selectedTrain ? 'Train' : store.selectedCruise ? 'Cruise' : 'Car',
      description,
      amount: total,
      userEmail: user?.email || 'guest',
      userName: user?.name || 'Guest',
    });
    setTimeout(() => router.push('/booking-confirmation'), 1500);
  };

  if (!hasBooking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <Card className="p-8 text-center max-w-md mx-auto">
          <p className="text-muted-foreground mb-6">No booking selected. Please select a flight, hotel, or tour first.</p>
          <Link href="/flights"><Button className="rounded-xl">Browse</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/booking-summary" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to summary
      </Link>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Secure Payment</h1>
      <p className="text-muted-foreground mb-8">Pay in INR. All transactions are secure.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex gap-3 mb-6 border-b border-border pb-4">
              {[
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'upi', label: 'UPI', icon: Smartphone },
                { id: 'netbanking', label: 'Net Banking', icon: Building2 },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${method === m.id ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
                >
                  <m.icon className="h-4 w-4" /> {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              {method === 'card' && (
                <>
                  <div>
                    <Label>Card number</Label>
                    <Input placeholder="1234 5678 9012 3456" className="mt-1 rounded-xl" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiry</Label>
                      <Input placeholder="MM/YY" className="mt-1 rounded-xl" />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input placeholder="123" type="password" className="mt-1 rounded-xl" maxLength={4} />
                    </div>
                  </div>
                  <div>
                    <Label>Name on card</Label>
                    <Input placeholder="Full name" className="mt-1 rounded-xl" />
                  </div>
                </>
              )}
              {method === 'upi' && (
                <div>
                  <Label>UPI ID</Label>
                  <Input placeholder="yourname@upi" className="mt-1 rounded-xl" />
                  <p className="text-xs text-muted-foreground mt-1">You will be redirected to your UPI app to confirm.</p>
                </div>
              )}
              {method === 'netbanking' && (
                <div>
                  <Label>Select bank</Label>
                  <select className="mt-1 flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm">
                    <option value="">Choose bank</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>Secured with SSL. Your payment details are encrypted.</span>
              </div>
              <Button type="submit" className="w-full rounded-xl" size="lg" disabled={processing}>
                {processing ? 'Processing…' : `Pay ${formatPrice(total)}`}
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="font-semibold mb-4">Order summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes & fees (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 shrink-0" />
              <span>100% secure payment. Cancel as per policy.</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
