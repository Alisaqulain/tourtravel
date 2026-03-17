import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true, sparse: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'CharDhamPackage', required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    seats: { type: Number, required: true, min: 1 },
    travelDate: { type: Date, required: true },
    specialRequest: { type: String, trim: true },
    baseAmount: { type: Number, required: true, min: 0, default: 0 },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    discountAmount: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    bookingStatus: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    cancelToken: { type: String },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ packageId: 1 });
bookingSchema.index({ paymentStatus: 1 });

export const CharDhamBooking = mongoose.models?.CharDhamBooking || mongoose.model('CharDhamBooking', bookingSchema);
