import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';
import { error } from '@/lib/apiResponse';
import { loginSchema } from '@/lib/validations/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors?.[0]?.message || 'Email and password required';
      return error(msg, 400);
    }
    const { email, password } = parsed.data;
    await connectDB();
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return error('Invalid email or password', 401);
    }
    if (user.isBlocked) {
      return error('Account is blocked. Contact support.', 403);
    }
    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
    const userPayload = { id: user._id, name: user.name, email: user.email, role: user.role };
    const res = NextResponse.json({
      success: true,
      data: { user: userPayload },
      user: userPayload,
      message: 'Logged in',
    });
    setAuthCookie(res, token);
    return res;
  } catch (e) {
    console.error('Login error:', e);
    return error(process.env.NODE_ENV === 'development' ? e.message : 'Login failed', 500);
  }
}
