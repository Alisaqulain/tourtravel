import { connectDB } from '@/lib/db';
import { Booking } from '@/models/Booking';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';
import { createBookingSchema } from '@/lib/validations/booking';

function generateBookingId() {
  return 'TT' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    await connectDB();
    const list = await Booking.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    return success({ bookings: list });
  } catch (e) {
    console.error('Bookings GET error:', e);
    return error('Failed to fetch bookings', 500);
  }
}

export async function POST(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    const body = await request.json();
    const parsed = createBookingSchema.safeParse({
      ...body,
      subtotal: body.subtotal != null ? Number(body.subtotal) : 0,
      tax: body.tax != null ? Number(body.tax) : 0,
      total: body.total != null ? Number(body.total) : 0,
    });
    if (!parsed.success) {
      const msg = parsed.error.errors?.[0]?.message || 'Invalid booking data';
      return error(msg, 400);
    }
    const { type, item, subtotal, tax, total, currency } = parsed.data;
    await connectDB();
    const bookingId = generateBookingId();
    const booking = await Booking.create({
      userId: user._id,
      bookingId,
      type,
      item: item && typeof item === 'object' ? item : {},
      subtotal,
      tax,
      total,
      currency: currency || 'INR',
      status: 'pending',
    });
    return success(
      { booking: { id: booking._id, bookingId: booking.bookingId, total: booking.total } },
      'Booking created'
    );
  } catch (e) {
    console.error('Create booking error:', e);
    return error(process.env.NODE_ENV === 'development' ? e.message : 'Failed to create booking', 500);
  }
}
