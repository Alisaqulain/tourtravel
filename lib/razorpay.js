/**
 * Razorpay instance – single instance for the app. Keys from env.
 * Never expose RAZORPAY_KEY_SECRET to the client.
 */

import Razorpay from 'razorpay';

let instance = null;

/**
 * @returns {Razorpay|null} Razorpay instance or null if keys not set
 */
export function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  if (!instance) {
    instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return instance;
}

/**
 * Check if Razorpay is configured (for conditional payment UI).
 */
export function isRazorpayConfigured() {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}
