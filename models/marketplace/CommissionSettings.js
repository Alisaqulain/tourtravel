import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    commissionPercent: { type: Number, required: true, min: 0, max: 100, default: 15 },
  },
  { timestamps: true }
);

export const CommissionSettings = mongoose.models?.CommissionSettings || mongoose.model('CommissionSettings', schema);
