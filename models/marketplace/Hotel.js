import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, trim: true, maxlength: 200, sparse: true },
    description: { type: String, trim: true, maxlength: 2000 },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    country: { type: String, trim: true, maxlength: 100 },
    images: [{ type: String }],
    amenities: [{ type: String }],
    documents: [{ type: String }],
    starRating: { type: Number, min: 1, max: 5 },
    totalRooms: { type: Number, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    status: {
      type: String,
      enum: ['pending', 'pending_verification', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String, trim: true },
    adminNote: { type: String, trim: true, maxlength: 1000 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

hotelSchema.index({ slug: 1 }, { unique: true, sparse: true });
hotelSchema.index({ status: 1 });

export const Hotel = mongoose.models?.Hotel || mongoose.model('Hotel', hotelSchema);
