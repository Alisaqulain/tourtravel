import { connectDB } from '@/lib/db';
import { Listing } from '@/models/Listing';
import { normalizeFlight, normalizeHotel, normalizePackage, normalizeTour } from '@/lib/travel/mapper';

/**
 * Admin-created Listing docs merged into public /api/travel/* responses.
 */
export async function getAdminFlightsForTravel() {
  try {
    await connectDB();
    const rows = await Listing.find({ type: 'flight' }).sort({ createdAt: -1 }).lean();
    return rows.map((l) => {
      const d = l.data || {};
      const listingId = `admin-${l._id.toString()}`;
      const raw = {
        ...d,
        id: d.id || listingId,
        _id: listingId,
        provider: 'admin',
        images: Array.isArray(d.images) && d.images.length ? d.images : d.airlineLogo ? [d.airlineLogo] : [],
      };
      return normalizeFlight(raw);
    });
  } catch (e) {
    console.error('getAdminFlightsForTravel:', e);
    return [];
  }
}

export async function getAdminHotelsForTravel() {
  try {
    await connectDB();
    const rows = await Listing.find({ type: 'hotel' }).sort({ createdAt: -1 }).lean();
    return rows.map((l) => {
      const d = l.data || {};
      const listingId = `admin-${l._id.toString()}`;
      const raw = {
        ...d,
        id: d.id || listingId,
        _id: listingId,
        provider: 'admin',
      };
      return normalizeHotel(raw);
    });
  } catch (e) {
    console.error('getAdminHotelsForTravel:', e);
    return [];
  }
}

export async function getAdminPackagesForTravel() {
  try {
    await connectDB();
    const rows = await Listing.find({ type: 'package' }).sort({ createdAt: -1 }).lean();
    return rows.map((l) => {
      const d = l.data || {};
      const listingId = `admin-${l._id.toString()}`;
      const raw = {
        ...d,
        id: d.id || listingId,
        _id: listingId,
        provider: 'admin',
        name: d.name || d.title || '',
        images: Array.isArray(d.images) && d.images.length ? d.images : d.image ? [d.image] : [],
        inclusions: Array.isArray(d.inclusions)
          ? d.inclusions
          : Array.isArray(d.highlights)
            ? d.highlights
            : typeof d.highlights === 'string'
              ? d.highlights.split(',').map((s) => s.trim()).filter(Boolean)
              : [],
      };
      const n = normalizePackage(raw);
      return {
        ...n,
        originalPrice: Number(d.originalPrice) || n.price,
        discount: Number(d.discount) || 0,
      };
    });
  } catch (e) {
    console.error('getAdminPackagesForTravel:', e);
    return [];
  }
}

export async function getAdminToursForTravel() {
  try {
    await connectDB();
    const rows = await Listing.find({ type: 'tour' }).sort({ createdAt: -1 }).lean();
    return rows.map((l) => {
      const d = l.data || {};
      const listingId = `admin-${l._id.toString()}`;
      const raw = {
        ...d,
        id: d.id || listingId,
        _id: listingId,
        provider: 'admin',
        name: d.name || d.title || '',
        destination: d.destination || d.location || '',
        images: Array.isArray(d.images) && d.images.length ? d.images : d.image ? [d.image] : [],
      };
      const n = normalizeTour(raw);
      return {
        ...n,
        originalPrice: Number(d.originalPrice) || n.price,
      };
    });
  } catch (e) {
    console.error('getAdminToursForTravel:', e);
    return [];
  }
}
