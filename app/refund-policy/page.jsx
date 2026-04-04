import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportContactBlock } from '@/components/support-contact-block';

const COMPANY_NAME = 'Triptotravels';

export const metadata = {
  title: 'Refund Policy',
  description: `Refund and cancellation policy of ${COMPANY_NAME}. Hotels, flights, trains subject to provider policy.`,
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
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Hotels</h2>
          <p>Hotel refunds are subject to the provider (property) policy. Free cancellation and refund rules are displayed at the time of booking. Outside the free cancellation window, partial or no refund may apply as per the property terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Flights</h2>
          <p>Airline cancellation rules apply. Refund eligibility and deductions depend on the fare type and airline policy. Non-refundable fares may not qualify for refund; refundable fares may incur airline cancellation charges.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Trains</h2>
          <p>Train refunds are as per railway rules (e.g. Indian Railway policy). Refund amount and charges depend on when you cancel relative to departure. Please refer to the applicable railway terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Service Fee</h2>
          <p>Where a service or convenience fee is charged by {COMPANY_NAME}, such fee may be non-refundable once the booking is processed, even if the underlying booking is cancelled and a partial refund is issued by the provider.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Cancellation by You</h2>
          <p>If you cancel a booking, refund eligibility and any deduction (cancellation fees) are as per the terms displayed at the time of booking. Refunds, when applicable, will be credited to the original payment method within 7–14 business days.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">7. Failed or Disputed Payments</h2>
          <p>If a payment fails or is disputed, we will investigate and process a refund if the booking was not fulfilled or as required by law. Chargebacks may be contested with evidence of service delivery.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">8. How to Request a Refund</h2>
          <p>Contact us with your booking ID and reason. We will respond within 2–3 business days and process eligible refunds as per this policy and provider rules.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">9. Contact</h2>
          <p>For refund requests or queries:</p>
          <SupportContactBlock showAddress className="mt-2 text-foreground/90" />
        </section>
      </div>
      <Link href="/" className="inline-block mt-8">
        <Button variant="outline" className="rounded-xl">Back to Home</Button>
      </Link>
    </div>
  );
}
