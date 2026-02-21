import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: true, data: { user: null }, user: null });
    }
    await connectDB();
    const user = await User.findById(decoded.userId).select('name email role isBlocked');
    if (!user || user.isBlocked) return NextResponse.json({ success: true, data: { user: null }, user: null });
    const userPayload = { id: user._id, name: user.name, email: user.email, role: user.role };
    return NextResponse.json({ success: true, data: { user: userPayload }, user: userPayload });
  } catch (e) {
    console.error('Auth me error:', e);
    return NextResponse.json({ success: true, data: { user: null }, user: null });
  }
}
