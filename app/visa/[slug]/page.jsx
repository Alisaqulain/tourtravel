'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, FileCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const visaData = {
  'united-states': { country: 'United States', type: 'Tourist Visa (B1/B2)', processing: '15-20 days', desc: 'B1/B2 visa application support and documentation.', requirements: ['Valid passport', 'DS-160 form', 'Photo', 'Interview appointment'], fee: 'From $160' },
  'united-kingdom': { country: 'United Kingdom', type: 'Standard Visitor', processing: '3 weeks', desc: 'UK visitor visa with full document check.', requirements: ['Valid passport', 'Online application', 'Biometrics', 'Supporting documents'], fee: 'From £100' },
  'schengen-europe': { country: 'Schengen (Europe)', type: 'Short Stay', processing: '15 days', desc: 'Cover 26 European countries with one visa.', requirements: ['Valid passport', 'Application form', 'Travel insurance', 'Proof of accommodation'], fee: 'From €80' },
  'australia': { country: 'Australia', type: 'Visitor (600)', processing: '20-25 days', desc: 'Tourist stream visa application.', requirements: ['Valid passport', 'ImmiAccount application', 'Health requirements', 'Character requirements'], fee: 'From AUD 150' },
};

function slugify(s) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
}

export default function VisaDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const visa = visaData[slug];

  if (!visa) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Visa service not found.</p>
        <Link href="/visa" className="text-primary mt-4 inline-block">← Back to Visa</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/visa" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Visa Services
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Globe className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{visa.country}</h1>
              <p className="text-primary font-medium">{visa.type}</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-6">{visa.desc}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Clock className="h-4 w-4" /> Processing: {visa.processing}
          </div>
          <h3 className="font-semibold mb-2">Typical requirements</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
            {visa.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground mb-6">Fee: {visa.fee} (subject to change)</p>
          <Link href="/contact?subject=Visa">
            <Button className="rounded-xl">Contact for Visa Help</Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}
