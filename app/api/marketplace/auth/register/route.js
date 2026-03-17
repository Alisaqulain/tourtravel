import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';
import { error, success } from '@/lib/apiResponse';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role = 'customer' } = body;
    if (!name?.trim() || !email?.trim() || !password) {
      return error('Name, email and password are required', 400);
    }
    if (password.length < 6) return error('Password must be at least 6 characters', 400);
    const allowedRoles = ['customer', 'hotel_owner'];
    if (!allowedRoles.includes(role)) return error('Invalid role', 400);

    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return error('Email already registered', 400);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim() || '',
      role,
      isVerified: true,
    });

    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
    const res = success(
      { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
      'Registered successfully'
    );
    setAuthCookie(res, token);
    return res;
  } catch (e) {
    console.error('Marketplace register error:', e);
    return error(e.message || 'Registration failed', 500);
  }
}
