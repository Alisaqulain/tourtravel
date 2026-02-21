/**
 * GET /api/travel/bus?from=...&to=...&date=...&busType=...
 * &minPrice=0&maxPrice=5000&sortBy=price&order=asc&page=1&limit=12
 */
import { searchBus } from '@/lib/travel';
import { successPaginated, error } from '@/lib/apiResponse';
import { paginate, sortList } from '@/lib/travel/utils.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;
    const date = searchParams.get('date') || undefined;
    const busType = searchParams.get('busType') || undefined;
    const minPrice = searchParams.get('minPrice') != null ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') != null ? Number(searchParams.get('maxPrice')) : null;
    const sortBy = searchParams.get('sortBy') || 'price';
    const order = (searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';

    let data = await searchBus({ from, to, date });

    if (busType) data = data.filter((b) => (b.busType || '').toLowerCase().includes(busType.toLowerCase()));
    if (minPrice != null) data = data.filter((b) => (b.price ?? 0) >= minPrice);
    if (maxPrice != null) data = data.filter((b) => (b.price ?? 0) <= maxPrice);

    data = sortList(data, sortBy, order);
    const { data: pageData, total, page: p, totalPages } = paginate(data, { page, limit });

    return successPaginated(pageData, total, p, totalPages);
  } catch (err) {
    console.error('Bus API error:', err);
    return error(err.message || 'Bus search failed', 500);
  }
}
