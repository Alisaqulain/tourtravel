'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/lib/toast';

const CONTACT_EMAIL = 'support@tripstotravels.com';
const CONTACT_PHONE = '+91 1800 123 4567';
const CONTACT_ADDRESS = 'Trips To Travels, 123 MG Road, Bangalore 560001, India';
const HOURS = '24/7 (Support & Bookings)';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const subjectFromUrl = searchParams.get('subject') || '';
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (subjectFromUrl) setValue('subject', subjectFromUrl);
  }, [subjectFromUrl, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject || '',
          message: data.message,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || 'Failed to send message');
        return;
      }
      setSubmitted(true);
      toast.success('Message sent! We’ll get back to you within 24 hours.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-8">We’re here to help. Reach out for bookings, support, or feedback.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6 md:p-8">
            {submitted ? (
              <p className="text-primary font-medium">Thank you! We’ll get back to you within 24 hours.</p>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input {...register('name', { required: true })} className="mt-1 rounded-xl" placeholder="Your name" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input {...register('email', { required: true })} type="email" className="mt-1 rounded-xl" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <Label>Phone (optional)</Label>
                  <Input {...register('phone')} type="tel" className="mt-1 rounded-xl" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input {...register('subject')} className="mt-1 rounded-xl" placeholder="Booking, support, Visa, Careers, or feedback" defaultValue={subjectFromUrl} />
                </div>
                <div>
                  <Label>Message</Label>
                  <textarea
                    {...register('message', { required: true })}
                    rows={5}
                    className="mt-1 flex w-full rounded-xl border border-border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="How can we help?"
                  />
                </div>
                <Button type="submit" className="rounded-xl" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
              </form>
            )}
          </Card>
        </div>
        <div>
          <Card className="p-6 h-full">
            <h3 className="font-semibold mb-4">Get in touch</h3>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary">{CONTACT_EMAIL}</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="hover:text-primary">{CONTACT_PHONE}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{CONTACT_ADDRESS}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{HOURS}</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
