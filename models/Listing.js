import mongoose from 'mongoose';

/**
 * Admin-managed listable items: flights, hotels, tours, packages.
 * type + data (flexible snapshot) so frontend can merge with static data or use as primary.
 */
const listingSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['flight', 'hotel', 'tour', 'package'], required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

listingSchema.index({ type: 1 });

export const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
