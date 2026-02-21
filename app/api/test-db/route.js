/**
 * Test API: verifies MongoDB connection using real MONGODB_URI.
 * GET /api/test-db → { success: true, db: 'connected', mongodb: true }
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      data: { db: 'connected', mongodb: true },
      message: 'MongoDB connected successfully',
    });
  } catch (e) {
    console.error('Test DB error:', e);
    const isAuthError = e.name === 'MongoServerError' && (e.code === 8000 || (e.message || '').toLowerCase().includes('auth'));
    const message = isAuthError
      ? 'MongoDB authentication failed. Check Atlas: Database Access → correct user & password. If password has special chars (@, #, :, etc.), URL-encode them in MONGODB_URI.'
      : (e.message || 'Database connection failed');
    return NextResponse.json(
      {
        success: false,
        data: null,
        message,
        ...(process.env.NODE_ENV === 'development' && { error: e.message }),
      },
      { status: 503 }
    );
  }
}
