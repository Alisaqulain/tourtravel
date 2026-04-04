import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportContactBlock } from '@/components/support-contact-block';

const COMPANY_NAME = 'Trips To Travels';

export const metadata = {
  title: 'Terms and Conditions',
  description: `Terms and Conditions of use for ${COMPANY_NAME} website and booking services.`,
  openGraph: { title: `Terms and Conditions | ${COMPANY_NAME}` },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms and Conditions</h1>
      <p className="text-foreground/80 mb-8">
        Last updated: {new Date().toISOString().slice(0, 10)}. By using <strong>{COMPANY_NAME}</strong> (&quot;Site&quot;), you agree to these terms.
      </p>

      <div className="prose prose-invert max-w-none space-y-8 text-foreground/80">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. Use of Service</h2>
          <p>You may use our platform to search and book travel services (flights, hotels, trains, tours, packages, etc.) for personal, non-commercial use. You must provide accurate information and be at least 18 years old to make a booking.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Bookings and Payments</h2>
          <p>All payments are processed securely through Razorpay. By completing a booking you agree to pay the total amount shown. Prices and availability are subject to change until payment is confirmed. Cancellation and refunds are as per our Refund Policy and the specific product terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Account and Data</h2>
          <p>You are responsible for keeping your account credentials secure. Your use of the Site is also governed by our Privacy Policy. We may suspend or terminate accounts for breach of these terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Limitation of Liability</h2>
          <p>We act as an intermediary between you and travel providers. We are not liable for the acts or omissions of airlines, hotels, or other third parties. Our liability is limited to the extent permitted by law and in any case to the amount paid for the relevant booking.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Changes</h2>
          <p>We may update these terms from time to time. Continued use of the Site after changes constitutes acceptance. For material changes we will notify via email or a notice on the Site.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Contact</h2>
          <p>For questions about these terms:</p>
          <SupportContactBlock showAddress className="mt-2 text-foreground/90" />
        </section>
      </div>
      <Link href="/" className="inline-block mt-8">
        <Button variant="outline" className="rounded-xl">Back to Home</Button>
      </Link>
    </div>
  );
}
