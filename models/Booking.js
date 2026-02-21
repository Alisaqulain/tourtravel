import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ['Flight', 'Hotel', 'Tour', 'Package', 'Bus', 'Cruise', 'Car', 'Visa'],
      required: true,
    },
    item: { type: mongoose.Schema.Types.Mixed, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentOrderId: String,
    paymentId: String,
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ status: 1 });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
