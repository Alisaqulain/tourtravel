import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AffiliateClick } from '@/models/AffiliateClick';
import { getAuthUser } from '@/lib/authGuard';

export async function POST(request) {
  try {
    const body = await request.json();
    const { provider, itemId } = body || {};
    if (!provider) return NextResponse.json({ ok: false }, { status: 400 });
    const valid = ['skyscanner', 'kayak', 'booking', 'amadeus'];
    if (!valid.includes(provider)) return NextResponse.json({ ok: false }, { status: 400 });
    const user = await getAuthUser(request);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    await connectDB();
    await AffiliateClick.create({
      provider,
      itemId: itemId || null,
      userId: user?._id || null,
      ip,
      userAgent,
      referrer,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Affiliate track:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
