import { connectDB } from '@/lib/db';
import { Notification } from '@/models/Notification';
import { getAuthUser } from '@/lib/authGuard';
import { success, error } from '@/lib/apiResponse';

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20', 10) || 20);
    const unreadOnly = searchParams.get('unread') === 'true';
    await connectDB();
    const q = { userId: user._id };
    if (unreadOnly) q.isRead = false;
    const list = await Notification.find(q).sort({ createdAt: -1 }).limit(limit).lean();
    const unreadCount = await Notification.countDocuments({ userId: user._id, isRead: false });
    return success({ notifications: list, unreadCount });
  } catch (e) {
    console.error('Notifications GET:', e);
    return error('Failed to load notifications', 500);
  }
}

export async function PATCH(request) {
  const user = await getAuthUser(request);
  if (!user) return error('Login required', 401);
  try {
    const body = await request.json();
    const { id, markAllRead } = body || {};
    await connectDB();
    if (markAllRead) {
      await Notification.updateMany({ userId: user._id }, { isRead: true });
      return success({ updated: true });
    }
    if (id) {
      await Notification.findOneAndUpdate(
        { _id: id, userId: user._id },
        { isRead: true }
      );
      return success({ updated: true });
    }
    return error('id or markAllRead required', 400);
  } catch (e) {
    console.error('Notifications PATCH:', e);
    return error('Failed to update', 500);
  }
}
