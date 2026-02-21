/**
 * Validate required env in production. Call early (e.g. in API route or server startup).
 * Dev-friendly: logs missing vars instead of throwing when NODE_ENV !== 'production'.
 */

const REQUIRED = [
  'MONGODB_URI',
  'JWT_SECRET',
];

const OPTIONAL_FOR_PAYMENT = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];

export function validateEnv() {
  const missing = REQUIRED.filter((key) => {
    const v = process.env[key];
    return !v || (key === 'JWT_SECRET' && v === 'your-secret-change-in-production');
  });
  if (missing.length === 0) return { ok: true };
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required env: ${missing.join(', ')}`);
  }
  console.warn('[env] Missing or invalid (required in production):', missing.join(', '));
  return { ok: false, missing };
}

export function isPaymentConfigured() {
  return OPTIONAL_FOR_PAYMENT.every((k) => process.env[k]);
}
