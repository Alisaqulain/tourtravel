/**
 * GET /api/travel/hotels?cityCode=DEL&search=...&checkIn=...&checkOut=...&adults=1
 * &minPrice=0&maxPrice=20000&minRating=4&starRating=5&amenities=Pool,WiFi
 * &freeCancellation=true&sortBy=pricePerNight&order=asc&page=1&limit=12
 */
import { searchHotels } from '@/lib/travel';
import { successPaginated, error } from '@/lib/apiResponse';
import { paginate, sortList } from '@/lib/travel/utils.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityCode = (searchParams.get('cityCode') || searchParams.get('city') || '').toUpperCase().slice(0, 3) || undefined;
    const search = searchParams.get('search') || undefined;
    const checkIn = searchParams.get('checkIn') || undefined;
    const checkOut = searchParams.get('checkOut') || undefined;
    const adults = Math.min(9, Math.max(1, parseInt(searchParams.get('adults') || '1', 10) || 1));
    const minPrice = searchParams.get('minPrice') != null ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') != null ? Number(searchParams.get('maxPrice')) : null;
    const minRating = searchParams.get('minRating') != null ? Number(searchParams.get('minRating')) : null;
    const starRating = searchParams.get('starRating') != null ? Number(searchParams.get('starRating')) : null;
    const amenitiesParam = searchParams.get('amenities');
    const amenitiesFilter = amenitiesParam ? amenitiesParam.split(',').map((a) => a.trim().toLowerCase()) : [];
    const freeCancellation = searchParams.get('freeCancellation');
    const sortBy = searchParams.get('sortBy') || 'pricePerNight';
    const order = (searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';

    let data = await searchHotels({ cityCode, search, checkIn, checkOut, adults, maxPrice: maxPrice ?? undefined, minRating: minRating ?? undefined });

    if (minPrice != null) data = data.filter((h) => (h.pricePerNight ?? 0) >= minPrice);
    if (maxPrice != null) data = data.filter((h) => (h.pricePerNight ?? 0) <= maxPrice);
    if (minRating != null) data = data.filter((h) => (h.reviewScore ?? h.starRating ?? 0) >= minRating);
    if (starRating != null) data = data.filter((h) => (h.starRating ?? 0) >= starRating);
    if (amenitiesFilter.length) {
      data = data.filter((h) => {
        const list = (h.amenities || []).map((a) => String(a).toLowerCase());
        return amenitiesFilter.every((a) => list.some((x) => x.includes(a) || a.includes(x)));
      });
    }
    if (freeCancellation === 'true' || freeCancellation === '1') {
      data = data.filter((h) => (h.cancellationPolicy || '').toLowerCase().includes('free'));
    }
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((h) => (h.name + ' ' + (h.city || '') + ' ' + (h.address || '')).toLowerCase().includes(q));
    }

    data = sortList(data, sortBy, order);
    const { data: pageData, total, page: p, totalPages } = paginate(data, { page, limit });

    return successPaginated(pageData, total, p, totalPages);
  } catch (err) {
    console.error('Hotels API error:', err);
    return error(err.message || 'Hotel search failed', 500);
  }
}
