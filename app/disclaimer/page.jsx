import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportContactBlock } from '@/components/support-contact-block';

const COMPANY_NAME = 'Triptotravels';
const LAST_UPDATED = '2025-02-01';

export const metadata = {
  title: 'Disclaimer',
  description: `Disclaimer and limitations of liability for ${COMPANY_NAME} travel booking platform.`,
  openGraph: { title: `Disclaimer | ${COMPANY_NAME}` },
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Disclaimer</h1>
      <p className="text-foreground/70 text-sm mb-8">
        Last updated: {LAST_UPDATED}. <strong>{COMPANY_NAME}</strong>
      </p>

      <div className="prose prose-invert max-w-none space-y-8 text-foreground/85">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. Platform Role</h2>
          <p>
            {COMPANY_NAME} acts as an intermediary between you and travel service providers (airlines, hotels, railways, tour operators, etc.). We do not operate flights, own hotels, or run trains. We facilitate booking and payment; the actual service is provided by third parties.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Information Accuracy</h2>
          <p>
            We strive to display accurate prices, availability, and product information. However, errors may occur. Final terms (including price, cancellation rules, and itinerary) are as confirmed by the provider at the time of booking. We are not liable for inaccuracies in third-party data.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, {COMPANY_NAME} is not liable for any loss, delay, injury, or damage arising from the acts or omissions of service providers, force majeure, or your use of the platform. Our liability is limited to the amount paid by you for the relevant booking, where applicable.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Affiliate & Third-Party Links</h2>
          <p>
            Our site may contain links to partner or affiliate sites. We are not responsible for the content, privacy practices, or terms of those sites. Use of such links is at your own risk.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. No Professional Advice</h2>
          <p>
            Travel advice (e.g. visa, health, safety) is for general information only and does not constitute professional advice. You are responsible for obtaining appropriate advice and complying with applicable laws for your trip.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Contact</h2>
          <p className="mb-2">For questions about this disclaimer:</p>
          <SupportContactBlock showAddress className="text-foreground/90" />
        </section>
      </div>
      <Link href="/" className="inline-block mt-8">
        <Button variant="outline" className="rounded-xl">Back to Home</Button>
      </Link>
    </div>
  );
}
