import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Hotel } from '@/models/marketplace/Hotel';
import { HotelWallet } from '@/models/marketplace/HotelWallet';
import { signToken, setAuthCookie } from '@/lib/auth';
import { error, success } from '@/lib/apiResponse';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      ownerName,
      email,
      password,
      phone,
      hotelName,
      hotelDescription,
      address,
      city,
      country,
      amenities,
      starRating,
      totalRooms,
      documents,
      images,
    } = body;

    if (!ownerName?.trim() || !email?.trim() || !password?.trim()) {
      return error('Owner name, email and password are required', 400);
    }
    if (!hotelName?.trim() || !address?.trim() || !city?.trim()) {
      return error('Hotel name, address and city are required', 400);
    }
    if (password.length < 6) return error('Password must be at least 6 characters', 400);

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) return error('Email already registered', 400);

    const user = await User.create({
      name: ownerName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim() || '',
      role: 'hotel_owner',
      isVerified: true,
    });

    const baseSlug = slugify(hotelName) || 'hotel';
    let slug = baseSlug;
    let exists = await Hotel.findOne({ slug });
    let n = 0;
    while (exists) {
      n += 1;
      slug = `${baseSlug}-${n}`;
      exists = await Hotel.findOne({ slug });
    }

    const hotel = await Hotel.create({
      ownerId: user._id,
      name: hotelName.trim(),
      slug,
      description: (hotelDescription || '').trim(),
      address: address.trim(),
      city: city.trim(),
      country: (country || '').trim(),
      amenities: Array.isArray(amenities) ? amenities : amenities ? [amenities] : [],
      images: Array.isArray(images) ? images : images ? [images] : [],
      documents: Array.isArray(documents) ? documents : documents ? [documents] : [],
      starRating: starRating != null ? Math.min(5, Math.max(1, Number(starRating))) : undefined,
      totalRooms: totalRooms != null ? Math.max(0, Number(totalRooms)) : 0,
      status: 'pending',
    });

    await HotelWallet.findOneAndUpdate(
      { hotelId: hotel._id },
      { $setOnInsert: { hotelId: hotel._id } },
      { upsert: true, new: true }
    );

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const res = success(
      {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        hotel: { id: hotel._id, name: hotel.name, status: hotel.status, slug: hotel.slug },
      },
      'Hotel application submitted. Your profile is under review.'
    );
    setAuthCookie(res, token);
    return res;
  } catch (e) {
    console.error('Hotel signup error:', e);
    return error(e.message || 'Registration failed', 500);
  }
}
