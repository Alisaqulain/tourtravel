'use client';

import { motion } from 'framer-motion';
import { Users, Globe, Award, Shield } from 'lucide-react';

const stats = [
  { icon: Users, value: '500K+', label: 'Happy travellers' },
  { icon: Globe, value: '120+', label: 'Countries' },
  { icon: Award, value: '4.9', label: 'Average rating' },
  { icon: Shield, value: '100%', label: 'Secure booking' },
];

export function StatsStrip() {
  return (
    <section className="py-8 border-y border-border bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex h-12 w-12 rounded-xl bg-primary/15 items-center justify-center mb-3">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
