import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketplaceBooking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

reviewSchema.index({ hotelId: 1 });
reviewSchema.index({ userId: 1 });

export const MarketplaceReview = mongoose.models?.MarketplaceReview || mongoose.model('MarketplaceReview', reviewSchema);
