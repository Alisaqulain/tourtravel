import Link from 'next/link';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COMPANY_NAME = 'Trips To Travels';
const SUPPORT_EMAIL = 'support@tripstotravels.com';
const SUPPORT_PHONE = '+91 1800 123 4567';

export const metadata = {
  title: 'Refund Policy',
  description: `Refund and cancellation policy of ${COMPANY_NAME}.`,
  openGraph: { title: `Refund Policy | ${COMPANY_NAME}` },
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Refund Policy</h1>
      <p className="text-foreground/80 mb-8">
        Last updated: {new Date().toISOString().slice(0, 10)}. <strong>{COMPANY_NAME}</strong> refund policy applies to all bookings made on our platform.
      </p>

      <div className="prose prose-invert max-w-none space-y-8 text-foreground/80">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. General</h2>
          <p>Refunds are processed as per the cancellation policy of the respective service (flight, hotel, tour, train, etc.). Eligibility and amounts depend on the provider and time of cancellation.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Cancellation by You</h2>
          <p>If you cancel a booking, refund eligibility and any deduction (cancellation fees) are as per the terms displayed at the time of booking. Refunds, when applicable, will be credited to the original payment method within 7–14 business days.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Failed or Disputed Payments</h2>
          <p>If a payment fails or is disputed, we will investigate and process a refund if the booking was not fulfilled or as required by law. Chargebacks may be contested with evidence of service delivery.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. How to Request a Refund</h2>
          <p>Contact us with your booking ID and reason. We will respond within 2–3 business days and process eligible refunds as per this policy and provider rules.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Contact</h2>
          <p>For refund requests or queries:</p>
          <ul className="list-none mt-2 space-y-1">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className="text-primary hover:underline">{SUPPORT_PHONE}</a>
            </li>
          </ul>
        </section>
      </div>
      <Link href="/" className="inline-block mt-8">
        <Button variant="outline" className="rounded-xl">Back to Home</Button>
      </Link>
    </div>
  );
}
