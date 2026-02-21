'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { setToastNotifier } from '@/lib/toast';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  default: null,
  success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
  error: <XCircle className="h-5 w-5 text-red-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-primary shrink-0" />,
};

const styles = {
  default: 'border-border bg-card',
  success: 'border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/30',
  error: 'border-red-500/40 bg-red-500/10 dark:bg-red-950/30',
  info: 'border-primary/40 bg-primary/10 dark:bg-primary/20',
};

export function Toaster() {
  const { toasts, remove, add } = useToastStore();

  useEffect(() => {
    setToastNotifier((payload) => add(payload));
    return () => setToastNotifier(null);
  }, [add]);

  return (
    <div
      className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 pointer-events-none sm:max-w-[400px]"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm',
                styles[t.variant] || styles.default
              )}
            >
              {icons[t.variant]}
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="shrink-0 rounded-lg p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
