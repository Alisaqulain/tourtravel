import { connectDB } from '@/lib/db';
import { PayoutRequest } from '@/models/marketplace/PayoutRequest';
import { requireAdmin } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function POST(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const { payoutId, action, adminNote } = body;
    if (!payoutId) return error('payoutId required', 400);
    if (!['approve', 'reject'].includes(action)) return error('action must be approve or reject', 400);

    await connectDB();
    const payout = await PayoutRequest.findById(payoutId);
    if (!payout) return error('Payout not found', 404);
    if (payout.status !== 'pending') return error('Payout is not pending', 400);

    if (action === 'reject') {
      const { HotelWallet } = await import('@/models/marketplace/HotelWallet');
      payout.status = 'rejected';
      payout.adminNote = adminNote?.trim();
      await payout.save();
      const wallet = await HotelWallet.findOne({ hotelId: payout.hotelId });
      if (wallet) {
        wallet.availableBalance += payout.amount;
        wallet.pendingWithdrawals -= payout.amount;
        await wallet.save();
      }
      return success({ payout: { id: payout._id, status: payout.status } }, 'Payout rejected');
    }

    payout.status = 'approved';
    payout.adminNote = adminNote?.trim();
    await payout.save();
    return success({ payout: { id: payout._id, status: payout.status } }, 'Payout approved');
  } catch (e) {
    console.error('Admin payout approve error:', e);
    return error(e.message || 'Failed', 500);
  }
}
