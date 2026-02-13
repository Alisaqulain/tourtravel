'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-dark-600 to-primary/80" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')] bg-cover bg-center opacity-20 mix-blend-overlay" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container relative z-10 mx-auto px-4 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Get the Best Deals in Your Inbox
        </h2>
        <p className="text-white/90 text-lg max-w-xl mx-auto mb-8">
          Subscribe to our newsletter and receive exclusive offers, travel tips, and early access to sales.
        </p>
        {submitted ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white text-lg font-medium"
          >
            Thanks for subscribing! Check your inbox for a welcome offer.
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 rounded-xl bg-white/10 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white"
              required
            />
            <Button type="submit" size="lg" className="gap-2 rounded-xl bg-white text-primary hover:bg-white/90 h-12">
              <Send className="h-5 w-5" /> Subscribe
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
