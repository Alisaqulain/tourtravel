/**
 * GET /api/travel/packages — admin-created packages only (no mock/provider data).
 */
import { NextResponse } from 'next/server';
import { getAdminPackagesForTravel } from '@/lib/adminListingsTravel';
import { successPaginated, error } from '@/lib/apiResponse';
import { paginate, sortList } from '@/lib/travel/utils.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = (searchParams.get('destination') || '').trim().toLowerCase();
    const duration = (searchParams.get('duration') || '').trim().toLowerCase();
    const minPrice = searchParams.get('minPrice') != null ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') != null ? Number(searchParams.get('maxPrice')) : null;
    const sortBy = searchParams.get('sortBy') || 'price';
    const order = (searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';
    const id = searchParams.get('id') || undefined;

    let data = await getAdminPackagesForTravel();

    if (id) {
      const one = data.find((p) => String(p.id) === String(id));
      if (one) return NextResponse.json({ success: true, data: one, total: 1, page: 1, totalPages: 1 });
      return NextResponse.json({ success: true, data: null, total: 0, page: 1, totalPages: 1 });
    }

    if (destination) {
      data = data.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const dests = Array.isArray(p.destinations) ? p.destinations.join(' ').toLowerCase() : '';
        return name.includes(destination) || dests.includes(destination);
      });
    }
    if (duration) {
      data = data.filter((p) => (p.duration || '').toLowerCase().includes(duration));
    }
    if (minPrice != null) data = data.filter((p) => (p.price ?? 0) >= minPrice);
    if (maxPrice != null) data = data.filter((p) => (p.price ?? 0) <= maxPrice);

    data = sortList(data, sortBy, order);
    const { data: pageData, total, page: p, totalPages } = paginate(data, { page, limit });

    return successPaginated(pageData, total, p, totalPages);
  } catch (err) {
    console.error('Packages API error:', err);
    return error(err.message || 'Package search failed', 500);
  }
}
