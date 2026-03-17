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

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('_id email').lean();
    if (!user) {
      return success({ message: 'If this email is registered, you will receive an OTP.' });
    }

    const otp = generateOtp();
    const expires = new Date(Date.now() + OTP_EXPIRY_MS);
    await User.updateOne(
      { _id: user._id },
      { $set: { resetOtp: otp, resetOtpExpires: expires } }
    );

    const baseUrl = getEmailBaseUrl(request);
    const result = await sendForgotPasswordOtpEmail(email, otp, baseUrl);
    const sent = result && result.sent === true;
    if (!sent) {
      const mailErr = result?.error || 'Email not configured';
      console.error('Forgot password email failed:', mailErr);
      return error('Could not send OTP. Check SMTP (SMTP_MAIL_FROM, SMTP_APP_PASSWORD) in .env.local and try again.', 500);
    }
    return success({ message: 'OTP sent to your email. If you don\'t see it, check your spam or junk folder.' });
  } catch (e) {
    console.error('Forgot password error:', e);
    return error(process.env.NODE_ENV === 'development' ? e.message : 'Request failed', 500);
  }
}
