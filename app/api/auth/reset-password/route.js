import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { error, success } from '@/lib/apiResponse';
import { resetPasswordSchema } from '@/lib/validations/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors?.[0]?.message || 'Invalid input';
      return error(msg, 400);
    }
    const { email, otp, newPassword } = parsed.data;
    await connectDB();
    const user = await User.findOne({ email }).select('+password +resetOtp +resetOtpExpires');
    if (!user) return error('Invalid request', 400);
    if (!user.resetOtp || !user.resetOtpExpires) return error('OTP expired or invalid', 400);
    if (new Date() > user.resetOtpExpires) {
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return error('OTP expired. Please request a new one.', 400);
    }
    if (user.resetOtp !== otp) return error('Invalid OTP', 400);
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();
    return success({ message: 'Password reset successfully.' });
  } catch (e) {
    console.error('Reset password error:', e);
    return error(process.env.NODE_ENV === 'development' ? e.message : 'Reset failed', 500);
  }
}
