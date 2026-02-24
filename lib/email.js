/**
 * Email sending via Gmail SMTP.
 * Uses Triptotravelsofficial@gmail.com as default sender.
 * Set SMTP_APP_PASSWORD (Gmail App Password) in .env.local.
 */

import nodemailer from 'nodemailer';

const FROM_EMAIL = (process.env.SMTP_MAIL_FROM || 'Triptotravelsofficial@gmail.com').trim();
// Gmail app passwords are 16 chars; strip spaces if user pasted with spaces (e.g. "abcd efgh ijkl mnop")
const APP_PASSWORD = (process.env.SMTP_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '').trim();

function getTransporter() {
  if (!APP_PASSWORD) {
    console.warn('Email: SMTP_APP_PASSWORD (or GMAIL_APP_PASSWORD) not set; emails will not be sent.');
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
 * Send an email.
 * @param {string} to - Recipient email
 * @param {string} subject - Subject
 * @param {string} html - HTML body
 * @param {string} [text] - Plain text fallback
 * @returns {Promise<{ sent: boolean, error?: string }>}
 */
export async function sendEmail(to, subject, html, text) {
  const transport = getTransporter();
  if (!transport) return { sent: false, error: 'Email not configured' };
  try {
    await transport.sendMail({
      from: `"Trips to Travels" <${FROM_EMAIL}>`,
      to,
      subject,
      html: html || text,
      text: text || html?.replace(/<[^>]+>/g, '') || '',
    });
    return { sent: true };
  } catch (e) {
    console.error('Send email error:', e);
    return { sent: false, error: e.message };
  }
}

/**
 * Send welcome email to new user.
 */
export async function sendWelcomeEmail(userEmail, userName) {
  const subject = 'Welcome to Trips to Travels';
  const html = `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2>Welcome, ${userName || 'Traveler'}!</h2>
      <p>Thank you for signing up at Trips to Travels. We're excited to have you.</p>
      <p>You can now log in and explore flights, hotels, tours, and packages.</p>
      <p>Happy travels!</p>
      <p>— The Trips to Travels Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
}

/**
 * Send OTP for forgot password. Use 6-digit OTP in email.
 */
export async function sendForgotPasswordOtpEmail(userEmail, otp) {
  const subject = 'Your password reset code - Trips to Travels';
  const html = `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2>Password reset</h2>
      <p>Use this one-time code to reset your password:</p>
      <p style="font-size: 24px; letter-spacing: 4px; font-weight: bold;">${otp}</p>
      <p>This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
      <p>— The Trips to Travels Team</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
}
