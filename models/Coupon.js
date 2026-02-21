import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    minOrderAmount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });
couponSchema.index({ expiryDate: 1, active: 1 });

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
