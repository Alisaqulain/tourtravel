import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    amount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'rejected'],
      default: 'pending',
    },
    requestDate: { type: Date, default: Date.now },
    paidDate: { type: Date },
    adminNote: { type: String, trim: true },
  },
  { timestamps: true }
);

payoutSchema.index({ hotelId: 1 });
payoutSchema.index({ status: 1 });

export const PayoutRequest = mongoose.models?.PayoutRequest || mongoose.model('PayoutRequest', payoutSchema);
