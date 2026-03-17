import { connectDB } from '@/lib/db';
import { CommissionSettings } from '@/models/marketplace/CommissionSettings';
import { requireAdmin } from '@/lib/marketplaceAuth';
import { error, success } from '@/lib/apiResponse';

export async function GET(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    await connectDB();
    let settings = await CommissionSettings.findOne({ key: 'default' }).lean();
    if (!settings) {
      await CommissionSettings.create({ key: 'default', commissionPercent: 15 });
      settings = { key: 'default', commissionPercent: 15 };
    }
    return success({ commissionPercent: settings.commissionPercent ?? 15 });
  } catch (e) {
    console.error('Commission get error:', e);
    return error('Failed', 500);
  }
}

export async function POST(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  try {
    const body = await request.json();
    const percent = Number(body?.commissionPercent);
    if (percent < 0 || percent > 100) return error('Commission must be between 0 and 100', 400);

    await connectDB();
    await CommissionSettings.findOneAndUpdate(
      { key: 'default' },
      { commissionPercent: percent },
      { upsert: true, new: true }
    );
    return success({ commissionPercent: percent }, 'Commission updated');
  } catch (e) {
    console.error('Commission update error:', e);
    return error('Failed', 500);
  }
}
