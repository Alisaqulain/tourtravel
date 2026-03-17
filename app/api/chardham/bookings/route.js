import { connectDB } from '@/lib/db';
import { CharDhamPackage } from '@/models/CharDhamPackage';
import { CharDhamBooking } from '@/models/CharDhamBooking';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

function generateBookingId() {
  return 'CD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return error('Login required', 401);
    const body = await request.json();
    const { packageId, fullName, email, phone, seats, travelDate, specialRequest } = body || {};
    console.log('[CharDham][BookingCreate] request', { userId: user._id?.toString(), packageId, seats, travelDate });
    if (!packageId || !fullName?.trim() || !email?.trim() || !phone?.trim() || seats == null || seats < 1 || !travelDate) {
      return error('Full name, email, phone, seats, and travel date are required', 400);
    }
    const numSeats = Number(seats);
    if (numSeats < 1) return error('At least 1 seat required', 400);

    await connectDB();
    const pkg = await CharDhamPackage.findById(packageId);
    if (!pkg) return error('Package not found', 404);
    if (pkg.seatsAvailable < numSeats) return error('Not enough seats available', 400);

    const baseAmount = (Number(pkg.price) || 0) * numSeats;
    const rules = Array.isArray(pkg.discountRules) ? pkg.discountRules : [];
    let discountPercent = 0;
    for (const r of rules) {
      const minSeats = Number(r?.minSeats) || 0;
      const percentOff = Number(r?.percentOff) || 0;
      if (minSeats > 0 && numSeats >= minSeats && percentOff > discountPercent) {
        discountPercent = percentOff;
      }
    }
    const discountAmount = Math.round((baseAmount * discountPercent) / 100);
    const totalAmount = Math.max(0, baseAmount - discountAmount);
    const bookingId = generateBookingId();
    const booking = await CharDhamBooking.create({
      bookingId,
      userId: user._id,
      packageId: pkg._id,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      seats: numSeats,
      travelDate: new Date(travelDate),
      specialRequest: specialRequest?.trim() || '',
      baseAmount,
      discountPercent,
      discountAmount,
      totalAmount,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
    });

    await CharDhamPackage.updateOne({ _id: packageId }, { $inc: { seatsAvailable: -numSeats } });
    console.log('[CharDham][BookingCreate] created', { bookingId, totalAmount, discountPercent, seats: numSeats });

    return success({
      booking: {
        id: booking._id?.toString(),
        bookingId,
        totalAmount,
        baseAmount,
        discountPercent,
        discountAmount,
        seats: numSeats,
      },
    }, 'Booking created');
  } catch (e) {
    console.error('CharDham booking POST:', e);
    return error(e.message || 'Failed to create booking', 500);
  }
}
