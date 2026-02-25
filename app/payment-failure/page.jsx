'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Payment could not be completed.';
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse rounded-xl bg-muted h-64 w-full max-w-md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Payment failed</h1>
        <p className="text-foreground/80 mb-8">{reason}</p>

        <Card className="p-6 text-left mb-8 rounded-xl">
          <h3 className="font-semibold mb-3">What you can do</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>• Try again with a different payment method.</li>
            <li>• Ensure your card/UPI has sufficient balance.</li>
            <li>• Contact your bank if the amount was deducted.</li>
            <li>• Reach out to us at <a href="/contact-us" className="text-primary hover:underline">Contact us</a> for support.</li>
          </ul>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/payment">
            <Button className="rounded-xl w-full sm:w-auto gap-2">
              <CreditCard className="h-4 w-4" /> Try again
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-xl w-full sm:w-auto gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
