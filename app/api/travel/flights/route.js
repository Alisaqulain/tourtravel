/**
 * GET /api/travel/flights?origin=DEL&destination=BOM&date=2025-03-15&adults=1
 * &minPrice=0&maxPrice=50000&stops=0&airline=IndiGo&refundable=true
 * &sortBy=price&order=asc&page=1&limit=12
 */
import { NextResponse } from 'next/server';
import { searchFlights } from '@/lib/travel';
import { successPaginated, error } from '@/lib/apiResponse';
import { paginate, sortList } from '@/lib/travel/utils.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = (searchParams.get('origin') || '').toUpperCase().slice(0, 3) || undefined;
    const destination = (searchParams.get('destination') || '').toUpperCase().slice(0, 3) || undefined;
    const date = searchParams.get('date') || undefined;
    const adults = Math.min(9, Math.max(1, parseInt(searchParams.get('adults') || '1', 10) || 1));
    const minPrice = searchParams.get('minPrice') != null ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') != null ? Number(searchParams.get('maxPrice')) : null;
    const stops = searchParams.get('stops') != null ? parseInt(searchParams.get('stops'), 10) : null;
    const airline = searchParams.get('airline') || undefined;
    const refundable = searchParams.get('refundable');
    const sortBy = searchParams.get('sortBy') || 'price';
    const order = (searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';
    const id = searchParams.get('id') || undefined;

    let data = await searchFlights({ origin, destination, date, adults });
    if (id) {
      const one = data.find((f) => f.id === id);
      if (one) return NextResponse.json({ success: true, data: one, total: 1, page: 1, totalPages: 1 });
      return NextResponse.json({ success: true, data: null, total: 0, page: 1, totalPages: 1 });
    }

    if (minPrice != null) data = data.filter((f) => f.price >= minPrice);
    if (maxPrice != null) data = data.filter((f) => f.price <= maxPrice);
    if (stops != null && !Number.isNaN(stops)) data = data.filter((f) => f.stops === stops);
    if (airline) data = data.filter((f) => (f.airline || '').toLowerCase().includes(airline.toLowerCase()));
    if (refundable === 'true' || refundable === '1') data = data.filter((f) => f.refundable);

    data = sortList(data, sortBy, order);
    const { data: pageData, total, page: p, totalPages } = paginate(data, { page, limit });

    return successPaginated(pageData, total, p, totalPages);
  } catch (err) {
    console.error('Flights API error:', err);
    return error(err.message || 'Flight search failed', 500);
  }
}
