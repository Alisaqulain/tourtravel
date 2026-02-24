'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SectionHeader({ title, subtitle, centered = true, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={cn('mb-12', centered && 'text-center', className)}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-foreground/90 text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}
