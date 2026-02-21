import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

newsletterSchema.index({ email: 1 });

export const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);
