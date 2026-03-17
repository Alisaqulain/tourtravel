import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000 },
    pricePerNight: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    totalRooms: { type: Number, required: true, min: 1 },
    availableRooms: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    amenities: [{ type: String }],
  },
  { timestamps: true }
);

roomSchema.index({ hotelId: 1 });

export const Room = mongoose.models?.Room || mongoose.model('Room', roomSchema);
