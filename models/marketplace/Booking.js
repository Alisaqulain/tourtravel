import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    commission: { type: Number, default: 0 },
    hotelEarning: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    bookingStatus: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ hotelId: 1 });
bookingSchema.index({ roomId: 1 });

export const MarketplaceBooking = mongoose.models?.MarketplaceBooking || mongoose.model('MarketplaceBooking', bookingSchema);
