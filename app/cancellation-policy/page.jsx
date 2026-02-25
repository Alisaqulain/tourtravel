import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COMPANY_NAME = 'Triptotravels';
const SUPPORT_EMAIL = 'support@tripstotravels.com';
const SUPPORT_PHONE = '+91 1800 123 4567';
const ADDRESS = 'Triptotravels, 123 MG Road, Bangalore 560001, India';
const LAST_UPDATED = '2025-02-01';

export const metadata = {
  title: 'Cancellation Policy',
  description: `Cancellation policy for hotels, flights, trains, and packages at ${COMPANY_NAME}.`,
  openGraph: { title: `Cancellation Policy | ${COMPANY_NAME}` },
};

export default function CancellationPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Cancellation Policy</h1>
      <p className="text-foreground/70 text-sm mb-8">
        Last updated: {LAST_UPDATED}. <strong>{COMPANY_NAME}</strong>
      </p>

      <div className="prose prose-invert max-w-none space-y-8 text-foreground/85">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. General</h2>
          <p>
            Cancellations are subject to the rules of the respective service provider (airline, hotel, railway, tour operator). We process cancellations as per their policy. Please request cancellation through your account or by contacting us.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Hotels</h2>
          <p>
            Hotel cancellations are subject to the property and booking rate. Free cancellation may apply if you cancel within the stated window; otherwise partial or no refund may apply as per the provider policy displayed at the time of booking.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Flights</h2>
          <p>
            Airline cancellation rules apply. Refund and cancellation fees depend on the fare type and airline policy. Non-refundable fares may not be eligible for refund; refundable fares may incur airline charges. Check your booking details for the exact terms.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Trains</h2>
          <p>
            Train cancellations are as per Indian Railway (or relevant railway) rules. Refunds and charges depend on when you cancel relative to departure. Please refer to the railway policy applicable to your booking.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Tour Packages & Other Services</h2>
          <p>
            Package and tour cancellations are governed by the operator&apos;s terms. Cancellation charges and refund eligibility vary by product and date of cancellation. Service fees charged by {COMPANY_NAME} may be non-refundable once the booking is processed.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. How to Cancel</h2>
          <p>
            Log in to your account, go to My Bookings, and select the booking to cancel where the option is available. For assistance, contact our support team using the details below.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">7. Contact Us</h2>
          <p className="mb-2">For cancellation requests or queries:</p>
          <ul className="list-none space-y-1 text-foreground/90">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className="text-primary hover:underline">{SUPPORT_PHONE}</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              {ADDRESS}
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
