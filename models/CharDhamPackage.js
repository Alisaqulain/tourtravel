import mongoose from 'mongoose';

const itineraryItemSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
}, { _id: false });

const discountRuleSchema = new mongoose.Schema(
  {
    minSeats: { type: Number, required: true, min: 1 },
    percentOff: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['standard', 'premium', 'luxury'], required: true },
    price: { type: Number, required: true, min: 0 },
    offerText: { type: String, trim: true, default: '', maxlength: 500 },
    duration: { type: String, required: true, trim: true },
    seatsAvailable: { type: Number, required: true, min: 0, default: 0 },
    shortDescription: { type: String, trim: true },
    fullDescription: { type: String, trim: true },
    highlights: [{ type: String }],
    itinerary: [itineraryItemSchema],
    included: [{ type: String }],
    excluded: [{ type: String }],
    specialFeatures: [{ type: String }],
    images: [{ type: String }],
    discountRules: [discountRuleSchema], // e.g. [{ minSeats: 3, percentOff: 5 }]
    isRecommended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

packageSchema.index({ category: 1 });
packageSchema.index({ isRecommended: 1 });

export const CharDhamPackage = mongoose.models?.CharDhamPackage || mongoose.model('CharDhamPackage', packageSchema);
