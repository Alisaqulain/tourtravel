import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Target, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COMPANY_NAME = 'Trips To Travels';
const SUPPORT_EMAIL = 'support@tripstotravels.com';
const SUPPORT_PHONE = '+91 1800 123 4567';
const ADDRESS = 'Trips To Travels, 123 MG Road, Bangalore 560001, India';

export const metadata = {
  title: 'About Us',
  description: `Learn about ${COMPANY_NAME} - your trusted travel partner for flights, hotels, tours, and packages. Best prices, 24/7 support.`,
  openGraph: {
    title: `About Us | ${COMPANY_NAME}`,
    description: `Learn about ${COMPANY_NAME} - your trusted travel partner.`,
  },
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="h-4 w-4" /> Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-foreground/80 mb-8">
        <strong>{COMPANY_NAME}</strong> is a leading online travel platform committed to making travel booking simple, secure, and affordable.
      </p>

      <section className="prose prose-invert max-w-none mb-10">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" /> Our Mission
        </h2>
        <p className="text-foreground/80 mb-6">
          We aim to provide a one-stop solution for flights, hotels, trains, tour packages, bus, cruise, and car rentals with the best price guarantee and 24/7 customer support.
        </p>

        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" /> Why Choose Us
        </h2>
        <ul className="list-disc pl-6 text-foreground/80 space-y-2 mb-6">
          <li>Best price guarantee on bookings</li>
          <li>Secure payments via Razorpay</li>
          <li>Instant confirmation and e-tickets</li>
          <li>Dedicated customer support</li>
        </ul>

        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Trust & Security
        </h2>
        <p className="text-foreground/80 mb-6">
          Your data and payments are protected. We use industry-standard encryption and are committed to transparency as outlined in our Privacy Policy and Terms & Conditions.
        </p>
      </section>

      <div className="rounded-xl border border-border bg-card/50 p-6">
        <h3 className="font-semibold mb-4">Contact {COMPANY_NAME}</h3>
        <ul className="space-y-2 text-sm text-foreground/80">
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>
          </li>
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className="text-primary hover:underline">{SUPPORT_PHONE}</a>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {ADDRESS}
          </li>
        </ul>
        <Link href="/contact-us" className="inline-block mt-4">
          <Button variant="outline" className="rounded-xl">Contact Us</Button>
        </Link>
      </div>
    </div>
  );
}
