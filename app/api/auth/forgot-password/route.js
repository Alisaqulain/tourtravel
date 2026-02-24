import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { error, success } from '@/lib/apiResponse';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { sendForgotPasswordOtpEmail, getEmailBaseUrl } from '@/lib/email';

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors?.[0]?.message || 'Invalid input';
      return error(msg, 400);
    }
    const { email } = parsed.data;
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists
      return success({ message: 'If this email is registered, you will receive an OTP.' });
    }
    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + OTP_EXPIRY_MS);
    await user.save({ validateBeforeSave: false });
    const baseUrl = getEmailBaseUrl(request);
    const { sent, error: mailErr } = await sendForgotPasswordOtpEmail(email, otp, baseUrl);
    if (!sent) {
      console.error('Forgot password email failed:', mailErr);
      return error('Failed to send OTP. Please try again.', 500);
    }
    return success({ message: 'OTP sent to your email.' });
  } catch (e) {
    console.error('Forgot password error:', e);
    return error(process.env.NODE_ENV === 'development' ? e.message : 'Request failed', 500);
  }
}
