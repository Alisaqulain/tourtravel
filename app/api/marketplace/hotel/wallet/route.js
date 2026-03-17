import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { HotelWallet } from '@/models/marketplace/HotelWallet';
import { requireHotelOwner } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function GET(request) {
  const { response, user } = await requireHotelOwner(request);
  if (response) return response;

  try {
    await connectDB();
    const hotel = await Hotel.findOne({ ownerId: user._id });
    if (!hotel) return error('Hotel not found', 404);

    let wallet = await HotelWallet.findOne({ hotelId: hotel._id });
    if (!wallet) {
      wallet = await HotelWallet.create({ hotelId: hotel._id });
    }
    return success({
      wallet: {
        totalEarnings: wallet.totalEarnings,
        availableBalance: wallet.availableBalance,
        pendingWithdrawals: wallet.pendingWithdrawals,
        totalWithdrawn: wallet.totalWithdrawn,
      },
    });
  } catch (e) {
    console.error('Wallet get error:', e);
    return error('Failed to get wallet', 500);
  }
}
