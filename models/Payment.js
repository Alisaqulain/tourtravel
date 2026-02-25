import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    payment_status: {
      type: String,
      enum: ['created', 'captured', 'failed'],
      default: 'created',
    },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ razorpay_order_id: 1 });

export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
