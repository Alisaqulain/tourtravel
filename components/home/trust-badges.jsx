'use client';

import { motion } from 'framer-motion';
import { Shield, Headphones, BadgeDollarSign, Lock } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'Secure booking', desc: 'SSL encrypted' },
  { icon: Headphones, label: '24/7 support', desc: 'Always here' },
  { icon: BadgeDollarSign, label: 'Transparent pricing', desc: 'No hidden fees' },
  { icon: Lock, label: 'Safe payments', desc: 'Razorpay secured' },
];

export function TrustBadges() {
  return (
    <section className="py-8 border-y border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-xl border border-border bg-background/50 px-4 py-4"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-foreground/60">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-foreground/60 mb-3">Trusted by travelers</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <span className="text-xs font-medium text-foreground/70">Razorpay</span>
            <span className="text-xs font-medium text-foreground/70">Secure Payments</span>
            <span className="text-xs font-medium text-foreground/70">Best Price Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
