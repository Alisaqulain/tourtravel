'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileCheck, Globe } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const visaServices = [
  { country: 'United States', type: 'Tourist Visa', processing: '15-20 days', desc: 'B1/B2 visa application support and documentation.' },
  { country: 'United Kingdom', type: 'Standard Visitor', processing: '3 weeks', desc: 'UK visitor visa with full document check.' },
  { country: 'Schengen (Europe)', type: 'Short Stay', processing: '15 days', desc: 'Cover 26 European countries with one visa.' },
  { country: 'Australia', type: 'Visitor (600)', processing: '20-25 days', desc: 'Tourist stream visa application.' },
];

export default function VisaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <SectionHeader
        title="Visa Services"
        subtitle="We help you with visa applications and documentation for popular destinations."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visaServices.map((v, i) => (
          <motion.div
            key={v.country}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="p-6 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{v.country}</h3>
                  <p className="text-sm text-primary font-medium">{v.type}</p>
                  <p className="text-muted-foreground text-sm mt-1">{v.desc}</p>
                  <p className="text-xs text-muted-foreground mt-2">Processing: {v.processing}</p>
                  <Button size="sm" variant="outline" className="mt-4 rounded-xl">Learn More</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-muted-foreground text-sm mt-8">
        This is a frontend demo. Visa services are not processed.
      </p>
    </div>
  );
}
