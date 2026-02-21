import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: String, required: true },
    type: {
      type: String,
      enum: ['flight', 'hotel', 'tour', 'package', 'bus', 'cruise', 'car'],
      required: true,
    },
    itemSnapshot: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ userId: 1, itemId: 1, type: 1 }, { unique: true });

export const Wishlist =
  mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
