import { connectDB } from '@/lib/db';
import { Hotel } from '@/models/marketplace/Hotel';
import { requireAdmin } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function POST(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const { hotelId, action, rejectionReason, adminNote } = body;
    if (!hotelId) return error('hotelId required', 400);
    if (!['approve', 'reject', 'request_documents'].includes(action)) {
      return error('action must be approve, reject, or request_documents', 400);
    }

    await connectDB();
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return error('Hotel not found', 404);

    if (action === 'approve') {
      hotel.status = 'approved';
      hotel.rejectionReason = undefined;
      hotel.adminNote = undefined;
    } else if (action === 'reject') {
      hotel.status = 'rejected';
      hotel.rejectionReason = rejectionReason?.trim() || 'Rejected by admin';
      hotel.adminNote = adminNote?.trim();
    } else {
      hotel.adminNote = adminNote?.trim() || 'Please submit additional documents.';
    }
    await hotel.save();

    return success(
      { hotel: { id: hotel._id, status: hotel.status, adminNote: hotel.adminNote } },
      action === 'request_documents' ? 'Request sent to owner' : `Hotel ${action}d`
    );
  } catch (e) {
    console.error('Admin hotel approve error:', e);
    return error(e.message || 'Failed', 500);
  }
}
