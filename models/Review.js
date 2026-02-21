import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: String },
    type: { type: String, enum: ['Flight', 'Hotel', 'Tour', 'Package', 'Bus', 'Cruise', 'Car'], required: true },
    itemId: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ type: 1, itemId: 1 });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
