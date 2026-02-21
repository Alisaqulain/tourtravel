import mongoose from 'mongoose';

const affiliateClickSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ['skyscanner', 'kayak', 'booking', 'amadeus'],
      required: true,
    },
    itemId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ip: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
  },
  { timestamps: true }
);

affiliateClickSchema.index({ provider: 1 });
affiliateClickSchema.index({ createdAt: -1 });

export const AffiliateClick =
  mongoose.models.AffiliateClick ||
  mongoose.model('AffiliateClick', affiliateClickSchema);
