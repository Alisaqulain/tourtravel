import { connectDB } from '@/lib/db';
import { Booking } from '@/models/Booking';
import { User } from '@/models/User';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const exportCsv = searchParams.get('export') === 'csv';

  try {
    await connectDB();
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
    }

    const list = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone')
      .lean();
    const data = list.map((b) => ({
      ...b,
      userName: b.userId?.name,
      userEmail: b.userId?.email,
      userPhone: b.userId?.phone,
      userId: undefined,
    }));

    if (exportCsv) {
      const headers = ['Booking ID', 'Type', 'User', 'Email', 'Phone', 'Subtotal', 'Tax', 'Total', 'Currency', 'Status', 'Payment ID', 'Date', 'Source'];
      const rows = data.map((b) => [
        b.bookingId,
        b.type,
        b.userName ?? '',
        b.userEmail ?? '',
        b.userPhone ?? '',
        b.subtotal,
        b.tax,
        b.total,
        b.currency ?? 'INR',
        b.status,
        b.paymentId ?? '',
        b.createdAt ? new Date(b.createdAt).toISOString() : '',
        b.source ?? 'manual',
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="bookings.csv"',
        },
      });
    }

    return success({ bookings: data });
  } catch (e) {
    console.error('Admin bookings error:', e);
    return error('Failed to load bookings', 500);
  }
}

/** PATCH – update booking status (e.g. cancel). Body: { bookingId, status } */
export async function PATCH(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;

  try {
    const body = await request.json();
    const { bookingId, status } = body;
    if (!bookingId) return error('bookingId required', 400);
    const allowed = ['pending', 'paid', 'failed', 'cancelled'];
    if (!allowed.includes(status)) return error('Invalid status', 400);

    await connectDB();
    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { status },
      { new: true }
    );
    if (!booking) return error('Booking not found', 404);
    return success({ bookingId: booking.bookingId, status: booking.status });
  } catch (e) {
    console.error('Admin bookings PATCH:', e);
    return error(e.message || 'Failed to update booking', 500);
  }
}
