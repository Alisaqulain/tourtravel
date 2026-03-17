import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { HotelWallet } from '@/models/marketplace/HotelWallet';
import { PayoutRequest } from '@/models/marketplace/PayoutRequest';
import { requireHotelOwner } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function POST(request) {
  const { response, user } = await requireHotelOwner(request);
  if (response) return response;

  try {
    const body = await request.json();
    const amount = Number(body?.amount);
    if (!amount || amount < 1) return error('Valid amount is required', 400);

    await connectDB();
    const hotel = await Hotel.findOne({ ownerId: user._id });
    if (!hotel) return error('Hotel not found', 404);

    let wallet = await HotelWallet.findOne({ hotelId: hotel._id });
    if (!wallet) wallet = await HotelWallet.create({ hotelId: hotel._id });

    if (wallet.availableBalance < amount) {
      return error('Insufficient balance', 400);
    }

    const payout = await PayoutRequest.create({
      hotelId: hotel._id,
      amount,
      status: 'pending',
    });

    wallet.availableBalance -= amount;
    wallet.pendingWithdrawals += amount;
    await wallet.save();

    return success(
      { payout: { id: payout._id, amount: payout.amount, status: payout.status } },
      'Payout requested'
    );
  } catch (e) {
    console.error('Payout request error:', e);
    return error(e.message || 'Failed to request payout', 500);
  }
}
