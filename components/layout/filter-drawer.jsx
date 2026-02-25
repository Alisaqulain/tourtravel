'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Full-screen drawer for filters on small/medium screens.
 * Use with same filter content as sidebar; on lg+ hide the button and show sidebar instead.
 */
export function FilterDrawer({ open, onClose, title = 'Filters', children }) {
  useEffect(() => {
    if (!open) return;
    const handle = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handle);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handle);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-background border-r border-border z-50 shadow-xl overflow-y-auto lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="sticky top-0 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg" aria-label="Close filters">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
