/**
 * GET /api/travel/cars?pickUp=...&dropOff=...&brand=Toyota&fuelType=Petrol
 * &transmission=Automatic&seats=5&minPrice=0&maxPrice=10000
 * &sortBy=pricePerDay&order=asc&page=1&limit=12
 */
import { searchCars } from '@/lib/travel';
import { successPaginated, error } from '@/lib/apiResponse';
import { paginate, sortList } from '@/lib/travel/utils.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pickUp = searchParams.get('pickUp') || searchParams.get('from') || undefined;
    const dropOff = searchParams.get('dropOff') || searchParams.get('to') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const fuelType = searchParams.get('fuelType') || undefined;
    const transmission = searchParams.get('transmission') || undefined;
    const seats = searchParams.get('seats') != null ? parseInt(searchParams.get('seats'), 10) : null;
    const minPrice = searchParams.get('minPrice') != null ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') != null ? Number(searchParams.get('maxPrice')) : null;
    const sortBy = searchParams.get('sortBy') || 'pricePerDay';
    const order = (searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';

    let data = await searchCars({ pickUp, dropOff, from: pickUp, to: dropOff });

    if (brand) data = data.filter((c) => (c.brand || c.name || '').toLowerCase().includes(brand.toLowerCase()));
    if (fuelType) data = data.filter((c) => (c.fuelType || '').toLowerCase() === fuelType.toLowerCase());
    if (transmission) data = data.filter((c) => (c.transmission || '').toLowerCase() === transmission.toLowerCase());
    if (seats != null && !Number.isNaN(seats)) data = data.filter((c) => (c.seats || 0) >= seats);
    if (minPrice != null) data = data.filter((c) => (c.pricePerDay ?? 0) >= minPrice);
    if (maxPrice != null) data = data.filter((c) => (c.pricePerDay ?? 0) <= maxPrice);

    data = sortList(data, sortBy, order);
    const { data: pageData, total, page: p, totalPages } = paginate(data, { page, limit });

    return successPaginated(pageData, total, p, totalPages);
  } catch (err) {
    console.error('Cars API error:', err);
    return error(err.message || 'Car search failed', 500);
  }
}
