/**
 * GET /api/travel/tours — admin-created tours only (no mock/provider data).
 */
import { NextResponse } from 'next/server';
import { getAdminToursForTravel } from '@/lib/adminListingsTravel';
import { successPaginated, error } from '@/lib/apiResponse';
import { paginate, sortList } from '@/lib/travel/utils.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = (searchParams.get('destination') || '').trim().toLowerCase();
    const minPrice = searchParams.get('minPrice') != null ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') != null ? Number(searchParams.get('maxPrice')) : null;
    const sortBy = searchParams.get('sortBy') || 'price';
    const order = (searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';
    const id = searchParams.get('id') || undefined;

    let data = await getAdminToursForTravel();

    if (id) {
      const one = data.find((t) => String(t.id) === String(id));
      if (one) return NextResponse.json({ success: true, data: one, total: 1, page: 1, totalPages: 1 });
      return NextResponse.json({ success: true, data: null, total: 0, page: 1, totalPages: 1 });
    }

    if (destination) {
      data = data.filter((t) => {
        const dest = (t.destination || '').toLowerCase();
        const name = (t.name || '').toLowerCase();
        return dest.includes(destination) || name.includes(destination);
      });
    }
    if (minPrice != null) data = data.filter((t) => (t.price ?? 0) >= minPrice);
    if (maxPrice != null) data = data.filter((t) => (t.price ?? 0) <= maxPrice);

    data = sortList(data, sortBy, order);
    const { data: pageData, total, page: p, totalPages } = paginate(data, { page, limit });

    return successPaginated(pageData, total, p, totalPages);
  } catch (err) {
    console.error('Tours API error:', err);
    return error(err.message || 'Tour search failed', 500);
  }
}
