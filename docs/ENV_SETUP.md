# Environment variables – what to add in `.env.local`

Backend is **100% ready**. Add these in **`.env.local`** (copy from `.env.example`). Any **Travel API** keys you add are used automatically by `/api/travel/flights` and `/api/travel/hotels`.

---

## Required (must set for production)

| Variable | Description | Example |
|----------|-------------|---------|
| **MONGODB_URI** | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/trips` or `mongodb://localhost:27017/trips-to-travels` |
| **JWT_SECRET** | Long random string for signing JWTs (never share) | Use `openssl rand -base64 32` or a long random string |
| **JWT_EXPIRES_IN** | Token expiry (optional) | `7d` (default) |

---

## Razorpay (required for real payments)

| Variable | Description | Where to get |
|----------|-------------|--------------|
| **RAZORPAY_KEY_ID** | Razorpay API key | [Razorpay Dashboard](https://dashboard.razorpay.com/) → Settings → API Keys |
| **RAZORPAY_KEY_SECRET** | Razorpay API secret | Same as above |

---

## Travel APIs (optional – add when you have keys)

When you add any of these, the backend uses them **automatically**. No code change needed.

### Amadeus (flights + hotels)

| Variable | Description |
|----------|-------------|
| **AMADEUS_API_KEY** | From [Amadeus for Developers](https://developers.amadeus.com/) |
| **AMADEUS_API_SECRET** | Same sign-up |
| **AMADEUS_BASE** | Optional. Omit or leave empty = test API (cached data). For **real-time** use: `https://api.amadeus.com` |

### Skyscanner (flights, affiliate – you earn)

| Variable | Description |
|----------|-------------|
| **SKYSCANNER_API_KEY** | From [Skyscanner Partners](https://www.partners.skyscanner.net/affiliates/travel-apis) |

### KAYAK (flights + hotels, affiliate)

| Variable | Description |
|----------|-------------|
| **KAYAK_API_KEY** | From [KAYAK Affiliate Network](https://affiliates.kayak.com/) |
| **KAYAK_AFFILIATE_ID** | Same sign-up (for affiliate links) |

### Booking.com (hotels, affiliate)

| Variable | Description |
|----------|-------------|
| **BOOKING_API_KEY** | From [Booking.com Developers](https://developers.booking.com/) |
| **BOOKING_AFFILIATE_ID** | Same sign-up |

---

## Provider order (which API is used first)

- **Flights:** Amadeus → Skyscanner → KAYAK (first with keys + results wins).
- **Hotels:** Amadeus → Booking.com → KAYAK.

If no provider is configured or all fail, the app falls back to **static data** from `data/flights.js` and `data/hotels.js`.

---

## Example `.env.local` (minimal – no travel APIs)

```env
MONGODB_URI=mongodb://localhost:27017/trips-to-travels
JWT_SECRET=your-long-random-secret-here
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## Example `.env.local` (with Amadeus for real flights/hotels)

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/trips
JWT_SECRET=your-long-random-secret-here
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Travel – Amadeus (real data when AMADEUS_BASE is production URL)
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret
AMADEUS_BASE=https://api.amadeus.com
```

---

## Checklist

- [ ] Copy `.env.example` to `.env.local`
- [ ] Set **MONGODB_URI** (required for auth & bookings)
- [ ] Set **JWT_SECRET** (required in production)
- [ ] Set **RAZORPAY_KEY_ID** and **RAZORPAY_KEY_SECRET** for payments
- [ ] (Optional) Add **AMADEUS_API_KEY** + **AMADEUS_API_SECRET** for real flights/hotels
- [ ] (Optional) For Amadeus **real-time** data, set **AMADEUS_BASE=https://api.amadeus.com**
- [ ] (Optional) Add **SKYSCANNER_API_KEY**, **KAYAK_***, **BOOKING_*** when you have them

After adding travel API keys, **restart the dev server** so env is picked up.
