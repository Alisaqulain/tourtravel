import { connectDB } from '@/lib/db';
import { Settings, getSettings } from '@/models/Settings';
import { requireAdminAuth } from '@/lib/adminGuard';
import { success, error } from '@/lib/apiResponse';

/** GET – return current business model settings (admin only). */
export async function GET(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    await connectDB();
    const settings = await getSettings();
    return success({
      businessModel: settings.businessModel,
      commissionPercentage: settings.commissionPercentage,
      markupPercentage: settings.markupPercentage,
      taxPercentage: settings.taxPercentage,
      currency: settings.currency,
    });
  } catch (e) {
    console.error('Admin settings GET:', e);
    return error('Failed to load settings', 500);
  }
}

/** PUT – update business model and percentages (admin only). */
export async function PUT(request) {
  const { response } = await requireAdminAuth(request);
  if (response) return response;
  try {
    const body = await request.json();
    const businessModel = ['api', 'manual', 'hybrid'].includes(body.businessModel)
      ? body.businessModel
      : undefined;
    const commissionPercentage =
      typeof body.commissionPercentage === 'number'
        ? Math.max(0, Math.min(100, body.commissionPercentage))
        : undefined;
    const markupPercentage =
      typeof body.markupPercentage === 'number'
        ? Math.max(0, Math.min(100, body.markupPercentage))
        : undefined;
    const taxPercentage =
      typeof body.taxPercentage === 'number'
        ? Math.max(0, Math.min(100, body.taxPercentage))
        : undefined;
    const currency =
      typeof body.currency === 'string' && body.currency.trim()
        ? body.currency.trim().slice(0, 10)
        : undefined;

    await connectDB();
    const settings = await Settings.findOne();
    const doc = settings
      ? await Settings.findOneAndUpdate(
          { _id: settings._id },
          {
            ...(businessModel != null && { businessModel }),
            ...(commissionPercentage != null && { commissionPercentage }),
            ...(markupPercentage != null && { markupPercentage }),
            ...(taxPercentage != null && { taxPercentage }),
            ...(currency != null && { currency }),
          },
          { new: true }
        )
      : await Settings.create({
          businessModel: businessModel ?? 'hybrid',
          commissionPercentage: commissionPercentage ?? 0,
          markupPercentage: markupPercentage ?? 0,
          taxPercentage: taxPercentage ?? 0,
          currency: currency ?? 'INR',
        });

    return success({
      businessModel: doc.businessModel,
      commissionPercentage: doc.commissionPercentage,
      markupPercentage: doc.markupPercentage,
      taxPercentage: doc.taxPercentage,
      currency: doc.currency,
    });
  } catch (e) {
    console.error('Admin settings PUT:', e);
    return error(e.message || 'Failed to update settings', 500);
  }
}
