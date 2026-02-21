import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';
import { error } from '@/lib/apiResponse';
import { signupSchema } from '@/lib/validations/auth';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors?.[0]?.message || 'Invalid input';
      return error(msg, 400);
    }
    const { name, email, password } = parsed.data;
    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) return error('Email already registered', 400);
    const user = await User.create({ name, email, password });
    // Send welcome email (non-blocking; signup succeeds either way)
    sendWelcomeEmail(user.email, user.name).catch((err) => console.error('Welcome email error:', err));
    const userPayload = { id: user._id, name: user.name, email: user.email, role: user.role };
    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
    const res = NextResponse.json({
      success: true,
      data: { user: userPayload },
      user: userPayload,
      message: 'Registered successfully',
    });
    setAuthCookie(res, token);
    return res;
  } catch (e) {
    console.error('Signup error:', e);
    return error(process.env.NODE_ENV === 'development' ? e.message : 'Registration failed', 500);
  }
}
