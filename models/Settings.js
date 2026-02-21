import mongoose from 'mongoose';

/**
 * Global app settings (single-doc). Admin → Settings → Business Model.
 * businessModel: api | manual | hybrid
 */
const settingsSchema = new mongoose.Schema(
  {
    businessModel: {
      type: String,
      enum: ['api', 'manual', 'hybrid'],
      default: 'hybrid',
    },
    commissionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    markupPercentage: { type: Number, default: 0, min: 0, max: 100 },
    taxPercentage: { type: Number, default: 0, min: 0, max: 100 },
    currency: { type: String, default: 'INR' },
  },
  { timestamps: true }
);

export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

/** Get or create the single settings document. */
export async function getSettings() {
  let doc = await Settings.findOne();
  if (!doc) {
    doc = await Settings.create({
      businessModel: 'hybrid',
      commissionPercentage: 0,
      markupPercentage: 0,
      taxPercentage: 0,
      currency: 'INR',
    });
  }
  return doc;
}
