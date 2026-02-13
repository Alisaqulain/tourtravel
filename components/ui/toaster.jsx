'use client';

import { ToastProvider, ToastViewport } from '@/components/ui/toast';

export function Toaster() {
  return (
    <ToastProvider duration={4000} swipeDirection="right">
      <ToastViewport />
    </ToastProvider>
  );
}
