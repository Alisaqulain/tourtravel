'use client';

import { motion } from 'framer-motion';
import { Users, Globe, Award, Shield } from 'lucide-react';


const moreStats = [
  { icon: Users, value: '500K+', label: 'Happy travellers' },
  { icon: Globe, value: '120+', label: 'Countries' },
  { icon: Award, value: '4.9', label: 'Average rating' },
  { icon: Shield, value: '100%', label: 'Secure booking' },
  { icon: Users, value: '50K+', label: 'Hotels' },
  { icon: Globe, value: '24/7', label: 'Support' },
];

export function StatsStrip() {
  return (
    <section className="py-8 border-b border-[#EDE5DC]" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {moreStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center group"
            >
              <div className="inline-flex h-12 w-12 rounded-xl items-center justify-center mb-3 transition-colors bg-primary/20">
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
