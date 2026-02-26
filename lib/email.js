/**
 * Email sending via Gmail SMTP.
 * Works for both Triptotravels.com and Triptotravels.in.
 * Set SMTP_MAIL_FROM and SMTP_APP_PASSWORD in .env.local.
 */

import nodemailer from 'nodemailer';

const FROM_EMAIL = (process.env.SMTP_MAIL_FROM || 'Triptotravelsofficial@gmail.com').trim();
const APP_PASSWORD = (process.env.SMTP_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '').trim();

const BRAND_NAME = 'Triptotravels';

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
 * Includes plain text for better deliverability (reduces spam flag).
 * @param {string} userEmail
 * @param {string} otp - 6-digit code
 * @param {string} [baseUrl] - From getEmailBaseUrl(request)
 */
export async function sendForgotPasswordOtpEmail(userEmail, otp, baseUrl) {
  const url = baseUrl || getEmailBaseUrl();
  const resetUrl = `${url}/forgot-password?step=reset`;
  const subject = `Your password reset code - ${BRAND_NAME}`;
  const text = `Password reset - ${BRAND_NAME}\n\nYour one-time code: ${otp}\nThis code expires in 10 minutes.\n\nReset your password: ${resetUrl}\n\nIf you didn't request this, please ignore this email.\n— The ${BRAND_NAME} Team`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <div style="padding: 24px 0; border-bottom: 1px solid #eee;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 600;">Password reset</h1>
      </div>
      <p style="margin: 24px 0 16px;">Use this one-time code to reset your password:</p>
      <p style="font-size: 28px; letter-spacing: 6px; font-weight: 700; margin: 16px 0; padding: 16px; background: #f5f5f5; border-radius: 8px; text-align: center;">${otp}</p>
      <p style="margin: 8px 0 24px; color: #666;">This code expires in 10 minutes.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: #EAB308; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset password</a>
      </p>
      <p style="margin: 24px 0 0; font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
      <p style="margin: 16px 0 0; font-size: 13px; color: #999;">— The ${BRAND_NAME} Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html, text);
}

/**
 * Professional notification email (booking, payment, system).
 * @param {string} to - User email
 * @param {string} subject - Email subject
 * @param {string} title - Notification title
 * @param {string} [message] - Body text
 * @param {string} [link] - CTA URL
 * @param {string} [ctaText] - Button text (default: View details)
 */
export async function sendNotificationEmail(to, subject, title, message = '', link = '', ctaText = 'View details') {
  const url = getEmailBaseUrl();
  const href = link.startsWith('http') ? link : `${url}${link.startsWith('/') ? link : '/' + link}`;
  const text = `${title}\n\n${message}\n\n${ctaText}: ${href}\n\n— ${BRAND_NAME}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <div style="padding: 24px 0; border-bottom: 1px solid #eee;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 600;">${String(title).replace(/</g, '')}</h1>
      </div>
      ${message ? `<p style="margin: 24px 0; line-height: 1.5;">${String(message).replace(/</g, '&lt;')}</p>` : ''}
      ${link ? `<p style="margin: 24px 0;"><a href="${href}" style="display: inline-block; background: #EAB308; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">${String(ctaText).replace(/</g, '')}</a></p>` : ''}
      <p style="margin: 24px 0 0; font-size: 13px; color: #999;">— The ${BRAND_NAME} Team</p>
    </div>
  `;
  return sendEmail(to, subject, html, text);
}

/**
 * Professional offer/promo email for users.
 * @param {string} to - User email
 * @param {string} subject - Email subject
 * @param {string} title - Offer title
 * @param {string} [message] - Description
 * @param {string} [link] - CTA URL (e.g. /offers)
 * @param {string} [ctaText] - Button text (default: View offer)
 */
export async function sendOfferEmail(to, subject, title, message = '', link = '/offers', ctaText = 'View offer') {
  const url = getEmailBaseUrl();
  const href = link.startsWith('http') ? link : `${url}${link.startsWith('/') ? link : '/' + link}`;
  const text = `${title}\n\n${message}\n\n${ctaText}: ${href}\n\n— ${BRAND_NAME}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <div style="padding: 24px 0; border-bottom: 1px solid #eee;">
        <span style="font-size: 12px; font-weight: 600; color: #EAB308; text-transform: uppercase;">Special offer</span>
        <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 600;">${String(title).replace(/</g, '')}</h1>
      </div>
      ${message ? `<p style="margin: 24px 0; line-height: 1.5;">${String(message).replace(/</g, '&lt;')}</p>` : ''}
      <p style="margin: 24px 0;"><a href="${href}" style="display: inline-block; background: #EAB308; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">${String(ctaText).replace(/</g, '')}</a></p>
      <p style="margin: 24px 0 0; font-size: 13px; color: #999;">— The ${BRAND_NAME} Team</p>
    </div>
  `;
  return sendEmail(to, subject, html, text);
}

/**
 * Booking confirmation email after payment success.
 * @param {string} userEmail
 * @param {string} userName
 * @param {string} bookingId
 * @param {object} booking - Booking document or { type, total, currency, item }
 */
export async function sendBookingConfirmationEmail(userEmail, userName, bookingId, booking = {}) {
  const url = getEmailBaseUrl();
  const type = booking.type || 'Booking';
  const total = booking.total != null ? Number(booking.total) : 0;
  const currency = booking.currency || 'INR';
  const subject = `Booking confirmed ${bookingId} - ${BRAND_NAME}`;
  const myBookingsUrl = `${url}/my-bookings`;
  const text = `Booking confirmed\n\nHi ${String(userName).replace(/</g, '')},\nYour booking ${bookingId} (${type}) is confirmed. Total: ${currency} ${total}.\n\nView booking: ${myBookingsUrl}\n\n— The ${BRAND_NAME} Team`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <div style="padding: 24px 0; border-bottom: 1px solid #eee;">
        <span style="font-size: 12px; font-weight: 600; color: #16a34a;">Confirmed</span>
        <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 600;">Booking confirmed</h1>
      </div>
      <p style="margin: 24px 0;">Hi ${String(userName).replace(/</g, '')},</p>
      <p style="margin: 0 0 16px;">Your booking <strong>${String(bookingId).replace(/</g, '')}</strong> (${String(type).replace(/</g, '')}) is confirmed.</p>
      <p style="margin: 0 0 24px;">Total: <strong>${currency} ${total}</strong></p>
      <p style="margin: 24px 0;"><a href="${myBookingsUrl}" style="display: inline-block; background: #EAB308; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">View my bookings</a></p>
      <p style="margin: 24px 0 0; font-size: 13px; color: #999;">— The ${BRAND_NAME} Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html, text);
}
