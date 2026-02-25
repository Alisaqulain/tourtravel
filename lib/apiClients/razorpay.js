/**
 * Razorpay client wrapper.
 * Project already has lib/razorpay.js for server-side usage.
 * This module is for structured API layer; can re-export or extend lib/razorpay.js.
 */

// When integrating: import from '@/lib/razorpay' and re-export or wrap here
export async function createOrder(amount, currency, receipt) {
  // Use app/api/payment/create-order or lib/razorpay for real implementation
  return { orderId: null, amount, currency };
}

export async function verifyPayment(orderId, paymentId, signature) {
  return { verified: false };
}
