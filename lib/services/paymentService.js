/**
 * Payment service – create orders, verify payments (Razorpay).
 * Uses lib/razorpay or apiClients/razorpay when integrated.
 */

// import * as razorpay from '@/lib/apiClients/razorpay';

export async function createOrder(amount, currency, receipt, userId) {
  // Use app/api/payment/create-order in production
  return { orderId: null, amount, currency };
}

export async function verifyPayment(orderId, paymentId, signature) {
  return { verified: false };
}
