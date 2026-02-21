/**
 * GET /api/travel/packages?destination=...&duration=...&minPrice=0&maxPrice=200000
 * &sortBy=price&order=asc&page=1&limit=12
 */
import { searchPackages } from '@/lib/travel';
import { successPaginated, error } from '@/lib/apiResponse';
import { paginate, sortList } from '@/lib/travel/utils.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination') || undefined;
    const duration = searchParams.get('duration') || undefined;
    const minPrice = searchParams.get('minPrice') != null ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') != null ? Number(searchParams.get('maxPrice')) : null;
    const sortBy = searchParams.get('sortBy') || 'price';
    const order = (searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';

    let data = await searchPackages({ destination, duration });

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
