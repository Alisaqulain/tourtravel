'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = () => setSubmitted(true);

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
              <p className="text-primary font-medium">Thank you! We’ll get back to you soon.</p>
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
                  <Label>Subject</Label>
                  <Input {...register('subject')} className="mt-1 rounded-xl" placeholder="Booking, support, or feedback" />
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
                <Button type="submit" className="rounded-xl">Send Message</Button>
              </form>
            )}
          </Card>
        </div>
        <div>
          <Card className="p-6 h-full">
            <h3 className="font-semibold mb-4">Get in touch</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>support@tripstotravels.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>+1 (800) 555-0123</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>123 Travel Street, Suite 100, New York, NY 10001</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
