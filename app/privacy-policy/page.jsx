import Link from 'next/link';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COMPANY_NAME = 'Trips To Travels';
const SUPPORT_EMAIL = 'info@triptotravels.in';
const SUPPORT_PHONE = '+91 97177 46661';

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy of ${COMPANY_NAME} - how we collect, use, and protect your data.`,
  openGraph: { title: `Privacy Policy | ${COMPANY_NAME}` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-foreground/80 mb-8">
        Last updated: {new Date().toISOString().slice(0, 10)}. <strong>{COMPANY_NAME}</strong> (&quot;we&quot;, &quot;us&quot;) is committed to protecting your privacy.
      </p>

      <div className="prose prose-invert max-w-none space-y-8 text-foreground/80">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, making a booking, or contacting us: name, email, phone number, payment-related details (processed securely by Razorpay), and travel preferences necessary to fulfil your booking.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>We use your data to process bookings, send confirmations and updates, improve our services, comply with legal obligations, and communicate offers (with your consent where required). We do not sell your personal information to third parties.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Data Security</h2>
          <p>We use industry-standard measures to protect your data. Payment details are handled by Razorpay and are not stored on our servers in full. We retain booking and account data as required for legal and operational purposes.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Cookies & Analytics</h2>
          <p>We may use cookies and similar technologies to improve site functionality and analyse usage. You can manage cookie preferences in your browser settings.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Your Rights</h2>
          <p>You may request access, correction, or deletion of your personal data by contacting us. We will respond in accordance with applicable law.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Contact</h2>
          <p>For privacy-related queries contact us:</p>
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
