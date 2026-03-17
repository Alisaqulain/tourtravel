import { connectDB } from '@/lib/db';
import { PayoutRequest } from '@/models/marketplace/PayoutRequest';
import { HotelWallet } from '@/models/marketplace/HotelWallet';
import { requireAdmin } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function POST(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const { payoutId } = body;
    if (!payoutId) return error('payoutId required', 400);

    await connectDB();
    const payout = await PayoutRequest.findById(payoutId);
    if (!payout) return error('Payout not found', 404);
    if (payout.status !== 'approved') return error('Payout must be approved first', 400);

    const wallet = await HotelWallet.findOne({ hotelId: payout.hotelId });
    if (!wallet) return error('Wallet not found', 404);

    wallet.pendingWithdrawals -= payout.amount;
    wallet.totalWithdrawn += payout.amount;
    await wallet.save();

    payout.status = 'paid';
    payout.paidDate = new Date();
    await payout.save();

    return success({ payout: { id: payout._id, status: payout.status } }, 'Marked as paid');
  } catch (e) {
    console.error('Admin payout pay error:', e);
    return error(e.message || 'Failed', 500);
  }
}
