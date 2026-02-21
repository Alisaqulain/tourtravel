# Backend Travel APIs – Real Data & Earning Guide

Use these APIs to power **real** hotels, flights, cars, and tours on your site and **earn** via affiliate/commission when users book.

---

## Best options: cheap + you earn

| Provider | Flights | Hotels | Cars | Cost | How you earn |
|----------|---------|--------|------|------|----------------|
| **Skyscanner** | ✅ | ✅ | ✅ | **Free** (no API fees) | Revenue share on bookings |
| **KAYAK Affiliate** | ✅ | ✅ | ✅ | **Free** (affiliate only) | Commission per booking |
| **Booking.com Demand API** | ❌ | ✅ | ❌ | **Free** (affiliate) | Commission per booking |
| **Amadeus** | ✅ | ✅ | ✅ | Free tier + pay per call | No direct commission; you charge markup or use with affiliate links |

---

## 1. Skyscanner (flights, hotels, car hire) – **Best to start**

- **Cost:** No API fees, no monthly/yearly charges.
- **Earning:** Revenue-share commission when users book via your links.
- **Data:** Real live prices; you send users to Skyscanner to complete booking.
- **Apply:** [Skyscanner Partners – Travel APIs](https://www.partners.skyscanner.net/affiliates/travel-apis) (they approve businesses with real traffic).
- **Docs:** [Skyscanner API docs](https://developers.skyscanner.net/docs/getting-started/usage-guidelines).

**Use for:** Flights first, then hotels and cars. Best balance of **free + earn**.

---

## 2. KAYAK Affiliate Network (flights, hotels, cars)

- **Cost:** No API fees; affiliate/commission model.
- **Earning:** Commission on clicks/bookings from your links.
- **Data:** Real search data from 150M+ monthly searches; 5M+ hotels.
- **Apply:** [KAYAK Affiliate Network](https://affiliates.kayak.com/) → APIs section.
- **APIs:** Flights, hotels, cars, price trends, autocomplete.

**Use for:** One provider for flights + hotels + cars with a single partnership.

---

## 3. Booking.com Demand API (hotels only)

- **Cost:** Free for approved affiliate partners.
- **Earning:** Commission on hotel bookings; commission tracking in API.
- **Data:** Global accommodations (hostels to luxury).
- **Apply:** [Booking.com Developers](https://developers.booking.com/) → register as Managed Affiliate Partner.
- **Docs:** [Demand API](https://developers.booking.com/demand/docs/getting-started/try-out-the-api).

**Use for:** Deep hotel inventory and strong commission when users book hotels.

---

## 4. Amadeus for Developers (flights, hotels, more)

- **Cost:** Free monthly quota (e.g. 10k calls/month), then pay per extra call. Test environment is free but cached data.
- **Earning:** No built-in commission; you earn by adding your own markup or redirecting to your affiliate links (e.g. Skyscanner/KAYAK) for booking.
- **Data:** Real-time when on production; flights, hotels, airport/city data.
- **Sign up:** [Amadeus for Developers](https://developers.amadeus.com/).
- **Pricing:** [Amadeus pricing](https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/pricing/).

**Use for:** Reliable, professional APIs when you need one provider; combine with Skyscanner/KAYAK links to earn.

---

## Recommended strategy for your site

1. **Earning focus (no API cost):**  
   Apply for **Skyscanner** and **KAYAK** affiliate + APIs. Use them for flights, hotels, cars. You pay nothing and earn on every booking.

2. **Hotels emphasis:**  
   Add **Booking.com Demand API** for more hotel options and commission.

3. **If you need more control / one API:**  
   Use **Amadeus** for search and display, then send users to your Skyscanner/KAYAK affiliate links to complete booking so you still earn.

---

## Quick links

| Goal | Link |
|------|------|
| Skyscanner API (free + earn) | https://www.partners.skyscanner.net/affiliates/travel-apis |
| KAYAK Affiliate & APIs | https://affiliates.kayak.com/apis |
| Booking.com Demand API | https://developers.booking.com/demand/docs/getting-started/try-out-the-api |
| Amadeus (free tier + pay) | https://developers.amadeus.com/ |

---

## Env vars (for integration)

```env
# Skyscanner (when approved)
NEXT_PUBLIC_SKYSCANNER_API_URL=https://partners.skyscanner.net/apis
SKYSCANNER_API_KEY=your_key

# KAYAK Affiliate
KAYAK_AFFILIATE_ID=your_affiliate_id
KAYAK_API_KEY=your_key

# Booking.com (when approved)
BOOKING_API_KEY=your_key
BOOKING_AFFILIATE_ID=your_affiliate_id

# Amadeus (optional)
AMADEUS_API_KEY=your_key
AMADEUS_API_SECRET=your_secret
```

Keep all keys that must not be exposed in the browser in server-side only (e.g. Next.js API routes or server actions). Use `NEXT_PUBLIC_*` only for keys that are safe to expose (e.g. public affiliate IDs if required by the provider).
