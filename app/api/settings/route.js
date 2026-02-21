/**
 * GET /api/settings – public read of business model & currency (no auth).
 * Frontend uses this to adapt: API only, manual only, or hybrid.
 */
import { connectDB } from '@/lib/db';
import { getSettings } from '@/models/Settings';
import { success, error } from '@/lib/apiResponse';

export async function GET() {
  try {
    await connectDB();
    const settings = await getSettings();
    return success({
      businessModel: settings.businessModel,
      currency: settings.currency,
    });
  } catch (e) {
    console.error('Settings API error:', e);
    return error('Failed to load settings', 500);
  }
}
