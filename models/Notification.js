import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 200 },
    message: { type: String, maxlength: 1000 },
    isRead: { type: Boolean, default: false },
    link: { type: String },
    type: { type: String, enum: ['booking', 'payment', 'offer', 'system'], default: 'system' },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification =
  mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema);
