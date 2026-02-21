import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },
    discountPercentage: { type: Number, min: 0, max: 100, default: 0 },
    promoCode: { type: String, trim: true, uppercase: true, maxlength: 32 },
    expiryDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    image: { type: String, trim: true },
    link: { type: String, trim: true },
  },
  { timestamps: true }
);

offerSchema.index({ active: 1, expiryDate: 1 });

export const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);
