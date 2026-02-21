/**
 * GET /api/travel/visa?country=...&type=...&minPrice=0&maxPrice=20000
 * &sortBy=price&order=asc&page=1&limit=12
 */
import { searchVisa } from '@/lib/travel';
import { successPaginated, error } from '@/lib/apiResponse';
import { paginate, sortList } from '@/lib/travel/utils.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || undefined;
    const type = searchParams.get('type') || undefined;
    const minPrice = searchParams.get('minPrice') != null ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') != null ? Number(searchParams.get('maxPrice')) : null;
    const sortBy = searchParams.get('sortBy') || 'price';
    const order = (searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';

    let data = await searchVisa({ country, type });

    if (minPrice != null) data = data.filter((v) => (v.price ?? 0) >= minPrice);
    if (maxPrice != null) data = data.filter((v) => (v.price ?? 0) <= maxPrice);

    data = sortList(data, sortBy, order);
    const { data: pageData, total, page: p, totalPages } = paginate(data, { page, limit });

    return successPaginated(pageData, total, p, totalPages);
  } catch (err) {
    console.error('Visa API error:', err);
    return error(err.message || 'Visa search failed', 500);
  }
}
