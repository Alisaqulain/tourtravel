/**
 * Email sending via Gmail SMTP.
 * Works for both Triptotravels.com and Triptotravels.in.
 * Set SMTP_MAIL_FROM and SMTP_APP_PASSWORD in .env.local.
 */

import nodemailer from 'nodemailer';

const FROM_EMAIL = (process.env.SMTP_MAIL_FROM || 'Triptotravelsofficial@gmail.com').trim();
const APP_PASSWORD = (process.env.SMTP_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '').trim();

const BRAND_NAME = 'Trips to Travels';

function getTransporter() {
  if (!APP_PASSWORD) {
    console.warn('Email: SMTP_APP_PASSWORD not set; emails will not be sent.');
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: FROM_EMAIL,
      pass: APP_PASSWORD,
    },
  });
}

/**
 * Get base URL for links in emails. Works for both triptotravels.com and triptotravels.in.
 * @param {Request} [request] - Optional request to read host from (e.g. from API route)
 * @returns {string} e.g. https://triptotravels.com or https://triptotravels.in
 */
export function getEmailBaseUrl(request) {
  if (request) {
    try {
      const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
      const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      if (host) return `${proto}://${host}`.replace(/\/$/, '');
    } catch (_) {}
  }
  return (process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://triptotravels.com').replace(/\/$/, '');
}

/**
 * Send an email. Retries once on failure for reliability.
 */
export async function sendEmail(to, subject, html, text) {
  const transport = getTransporter();
  if (!transport) return { sent: false, error: 'Email not configured' };
  const payload = {
    from: `"${BRAND_NAME}" <${FROM_EMAIL}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html: html || text,
    text: text || (typeof html === 'string' ? html.replace(/<[^>]+>/g, '') : '') || '',
  };
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await transport.sendMail(payload);
      return { sent: true };
    } catch (e) {
      console.error(`Send email error (attempt ${attempt}/2):`, e?.message || e);
      if (attempt === 2) return { sent: false, error: e?.message || 'Send failed' };
    }
  }
  return { sent: false, error: 'Send failed' };
}

/**
 * Send welcome email to new user. Works for both .com and .in.
 * @param {string} userEmail
 * @param {string} [userName]
 * @param {string} [baseUrl] - From getEmailBaseUrl(request) so links match the domain used
 */
export async function sendWelcomeEmail(userEmail, userName, baseUrl) {
  const url = baseUrl || getEmailBaseUrl();
  const loginUrl = `${url}/login`;
  const subject = `Welcome to ${BRAND_NAME}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2>Welcome, ${userName ? String(userName).replace(/</g, '') : 'Traveler'}!</h2>
      <p>Thank you for signing up at ${BRAND_NAME}. We're excited to have you.</p>
      <p>You can now log in and explore flights, hotels, tours, and packages.</p>
      <p><a href="${loginUrl}" style="display: inline-block; background: #c41e3a; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Log in</a></p>
      <p>Happy travels!</p>
      <p>— The ${BRAND_NAME} Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
}

/**
 * Send OTP for forgot password. Works for both .com and .in.
 * @param {string} userEmail
 * @param {string} otp - 6-digit code
 * @param {string} [baseUrl] - From getEmailBaseUrl(request)
 */
export async function sendForgotPasswordOtpEmail(userEmail, otp, baseUrl) {
  const url = baseUrl || getEmailBaseUrl();
  const resetUrl = `${url}/forgot-password?step=reset`;
  const subject = `Your password reset code - ${BRAND_NAME}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2>Password reset</h2>
      <p>Use this one-time code to reset your password:</p>
      <p style="font-size: 24px; letter-spacing: 4px; font-weight: bold;">${otp}</p>
      <p>This code expires in 10 minutes.</p>
      <p><a href="${resetUrl}" style="display: inline-block; background: #c41e3a; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Reset password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>— The ${BRAND_NAME} Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
}

/**
 * Send booking confirmation email after successful payment.
 * @param {string} userEmail
 * @param {string} [userName]
 * @param {string} bookingId
 * @param {Object} booking - { type, item, total, currency }
 */
export async function sendBookingConfirmationEmail(userEmail, userName, bookingId, booking) {
  const type = booking?.type || 'Booking';
  const total = booking?.total != null ? Number(booking.total) : 0;
  const currency = booking?.currency || 'INR';
  const amountStr = currency === 'INR' ? `₹${total}` : `${currency} ${total}`;
  const subject = `Booking confirmed - ${bookingId} | ${BRAND_NAME}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2>Booking confirmed</h2>
      <p>Hi ${userName ? String(userName).replace(/</g, '') : 'Guest'},</p>
      <p>Your ${type} booking is confirmed.</p>
      <p><strong>Booking ID:</strong> ${String(bookingId).replace(/</g, '')}</p>
      <p><strong>Amount paid:</strong> ${amountStr}</p>
      <p>You can view and manage this booking anytime in <strong>My Bookings</strong> on our website.</p>
      <p>Thank you for choosing ${BRAND_NAME}!</p>
      <p>— The ${BRAND_NAME} Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
}
