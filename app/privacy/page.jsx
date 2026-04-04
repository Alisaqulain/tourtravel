'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: February 2025</p>

      <Card className="p-8 prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p className="text-muted-foreground">
          We collect information you provide when creating an account, making a booking, or contacting us. This may include name, email address, phone number, payment details, and travel preferences.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
        <p className="text-muted-foreground">
          We use your information to process bookings, send confirmations, improve our services, and communicate with you about your trips. We may also use it for marketing with your consent.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
        <p className="text-muted-foreground">
          We implement industry-standard security measures to protect your personal data. Payment information is processed through secure, encrypted channels.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Sharing of Information</h2>
        <p className="text-muted-foreground">
          We may share your information with airlines, hotels, and tour operators to fulfil your bookings. We do not sell your personal data to third parties.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
        <p className="text-muted-foreground">
          You have the right to access, correct, or delete your personal data. Contact us at info@triptotravels.in for any requests.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact</h2>
        <p className="text-muted-foreground">
          For questions about this Privacy Policy, contact us at <Link href="/contact" className="text-primary hover:underline">Contact Us</Link>.
        </p>
      </Card>
    </div>
  );
}
