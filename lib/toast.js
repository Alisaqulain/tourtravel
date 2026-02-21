/**
 * Global toast (flash popup) – use from any component.
 * Usage: import { toast } from '@/lib/toast'; toast.success('Done!'); toast.error('Failed');
 */

let addToastFn = null;

export function setToastNotifier(fn) {
  addToastFn = fn;
}

export function toast(message, variant = 'default') {
  if (typeof message === 'object' && message !== null) {
    variant = message.variant || 'default';
    message = message.message || message.title || '';
  }
  if (addToastFn) addToastFn({ message: String(message), variant });
}

toast.success = (message) => toast(message, 'success');
toast.error = (message) => toast(message, 'error');
toast.info = (message) => toast(message, 'info');
