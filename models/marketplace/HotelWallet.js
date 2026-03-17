import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, unique: true },
    totalEarnings: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    pendingWithdrawals: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const HotelWallet = mongoose.models?.HotelWallet || mongoose.model('HotelWallet', walletSchema);
