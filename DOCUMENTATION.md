# Trips To Travels – Project Documentation

This document describes the full-stack travel website, its structure, features, and what remains to be added. It also covers deployment and hosting.

---

## 1. Project Overview

**Trips To Travels** is a Next.js 14 travel booking website. It offers flights, hotels, tours, packages, bus, cruise, cars, and visa information. Users can sign up, log in, browse listings, add items to wishlist, complete bookings, and pay via Razorpay. An admin panel allows managing content, users, bookings, and business settings (API-only, manual-only, or hybrid mode).

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Database | MongoDB with Mongoose |
| Auth | JWT (httpOnly cookie + optional Bearer header) |
| State | Zustand (auth, admin, theme, travel filters, toast, wishlist, etc.) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Payments | Razorpay |
| Email | Nodemailer (Gmail SMTP) |
| Validation | Zod |
| UI components | Radix UI primitives, custom Card/Button/Input/Dialog etc. |

---

## 3. Site Structure

### 3.1 Public routes (no login)

Anyone can access:

- `/` – Home
- `/login`, `/signup`, `/forgot-password` – Auth
- `/about`, `/contact`, `/terms`, `/privacy`, `/cancellation` – Legal and info
- `/offers` – Offers listing
- `/flights`, `/flights/[id]` – Flights listing and detail
- `/hotels`, `/hotels/[id]` – Hotels listing and detail
- `/tours`, `/tours/[id]` – Tours listing and detail
- `/packages`, `/packages/[id]` – Packages listing and detail
- `/visa`, `/visa/[slug]` – Visa info
- `/cruise`, `/cruise/[id]` – Cruise listing and detail
- `/bus`, `/bus/[id]` – Bus listing and detail
- `/cars`, `/cars/[id]` – Cars listing and detail

### 3.2 Protected routes (login required)

If the user is not logged in, middleware redirects to `/signup` (with `?from=` for return URL):

- `/profile` – User profile
- `/my-bookings` – User bookings
- `/wishlist` – Wishlist
- `/notifications` – Notifications
- `/booking-summary` – Booking summary
- `/payment` – Payment page
- `/booking-confirmation` – Post-booking confirmation

### 3.3 Admin routes

- `/admin/login` – Admin login (no cookie required to view this page).
- All other `/admin/*` routes require a valid auth cookie and a user with role `admin` or `superadmin`. Otherwise, redirect to `/admin/login`.

Admin pages:

- `/admin` – Dashboard (stats, revenue, manual/API counts, business model badge)
- `/admin/settings` – Business model (API / Manual / Hybrid) and commission, markup, tax, currency
- `/admin/users` – User list (role, block, delete, total bookings/spend)
- `/admin/bookings` – Bookings list, filters (status, type, date), export CSV, change status
- `/admin/flights`, `/admin/flights/new`, `/admin/flights/[id]/edit` – Flights CRUD
- `/admin/hotels`, `/admin/hotels/new`, `/admin/hotels/[id]/edit` – Hotels CRUD
- `/admin/tours`, `/admin/tours/new`, `/admin/tours/[id]/edit` – Tours CRUD
- `/admin/packages`, `/admin/packages/new`, `/admin/packages/[id]/edit` – Packages CRUD
- `/admin/theme` – Website theme (built-in and custom themes, primary color)
- `/admin/analytics` – Charts (revenue by month, booking types, etc.)

---

## 4. Features

### 4.1 Authentication

- Signup: name, email, password; welcome email sent via SMTP.
- Login: email, password; JWT stored in httpOnly cookie; response includes user (id, name, email, role).
- Logout: POST clears cookie.
- Forgot password: email; OTP sent to email; reset with OTP + new password.
- Roles: `user`, `admin`, `superadmin`. Admin panel access for `admin` and `superadmin`.
- Blocked users: login and `/api/auth/me` reject if `isBlocked` is true.

### 4.2 Travel and listings

- Flights, hotels, tours, packages: data from `/api/travel/flights`, `/api/travel/hotels`, etc. with pagination and filters. Backend uses provider-agnostic engine in `lib/travel` (mock, Amadeus, Skyscanner, Kayak, Booking). Listing model stores admin-created items (type + data).
- Bus, cruise, cars, visa: pages and travel API routes exist; content can be mock or static.
- Unified API provider layer in `lib/apiProviders` exposes `getFlights()`, `getHotels()`, `getTours()` in a standard shape for future API plug-in.

### 4.3 Bookings and payments

- Booking flow: user selects item, goes to booking summary, then payment. Order created via `/api/payment/create-order` (Razorpay), then verification via `/api/payment/verify`. Booking is stored with status pending/paid/failed.
- Booking model: userId, bookingId, type, item, source (api/manual), subtotal, tax, total, currency, priceBreakdown, status (pending/paid/failed/cancelled), paymentOrderId, paymentId.

### 4.4 Contact and emails

- Contact form: POST `/api/contact` saves to Contact model and sends an email to `SMTP_MAIL_FROM` with the message.
- Welcome email on signup; OTP email for forgot password.

### 4.5 Business model and settings

- Settings model (single document): `businessModel` (api | manual | hybrid), `commissionPercentage`, `markupPercentage`, `taxPercentage`, `currency`.
- Admin can change these at `/admin/settings`. Public GET `/api/settings` returns businessModel and currency for frontend adaptation.
- Pricing engine in `lib/pricingEngine.js`: applies markup (API) or contract margin (manual) and tax.

### 4.6 Admin panel

- Dashboard: total users, bookings, revenue, pending/failed counts, manual listings count, API requests count, business model badge.
- Users: list with role, total bookings, total spend, block/unblock, delete, change role (user/admin/superadmin). Superadmin cannot be modified by others.
- Bookings: list with filters (status, type, date range), export CSV, change booking status (e.g. cancel).
- Flights/Hotels/Tours/Packages: full CRUD via admin API and forms (new/edit list).
- Theme: switch built-in themes and add custom theme by primary color.
- Analytics: revenue and bookings by month, booking type distribution (from existing analytics API).

### 4.7 Other

- Wishlist: add/remove items; stored per user.
- Notifications: in-app notifications (model and API).
- Coupons: validate endpoint exists; Coupon model present.
- Offers: GET `/api/offers` and Offer model for display.
- Affiliate tracking: POST `/api/affiliate/track` and AffiliateClick model.
- Rate limiting: middleware applies 100 requests per minute per IP on `/api/*`. Security headers (X-Frame-Options, X-Content-Type-Options, etc.) applied.

---

## 5. API Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| /api/auth/signup | POST | No | Register; sends welcome email |
| /api/auth/login | POST | No | Login; sets JWT cookie |
| /api/auth/logout | POST | No | Clear cookie |
| /api/auth/me | GET | Cookie | Current user (null if blocked) |
| /api/auth/forgot-password | POST | No | Send OTP to email |
| /api/auth/reset-password | POST | No | Reset with OTP + new password |
| /api/contact | POST | No | Submit contact form; email to SMTP_MAIL_FROM |
| /api/settings | GET | No | Public business model and currency |
| /api/test-db | GET | No | MongoDB connectivity check |
| /api/travel/flights | GET | No | Flights list (pagination, filters) |
| /api/travel/hotels | GET | No | Hotels list |
| /api/travel/tours | GET | No | Tours list |
| /api/travel/packages | GET | No | Packages list |
| /api/travel/bus | GET | No | Bus list |
| /api/travel/cruise | GET | No | Cruise list |
| /api/travel/cars | GET | No | Cars list |
| /api/travel/visa | GET | No | Visa list |
| /api/offers | GET | No | Offers list |
| /api/coupons/validate | POST | No | Validate coupon code |
| /api/wishlist | GET/POST/DELETE | Cookie | User wishlist |
| /api/wishlist/check | GET | Cookie | Check if item in wishlist |
| /api/bookings | GET/POST | Cookie | User bookings, create booking |
| /api/payment/create-order | POST | Cookie | Create Razorpay order |
| /api/payment/verify | POST | Cookie | Verify payment, update booking |
| /api/notifications | GET/PATCH | Cookie | Notifications list, mark read |
| /api/affiliate/track | POST | No | Track affiliate click |
| /api/admin/stats | GET | Admin | Dashboard stats |
| /api/admin/settings | GET/PUT | Admin | Business model and pricing settings |
| /api/admin/users | GET/PATCH/DELETE | Admin | List users, update role/block, delete |
| /api/admin/bookings | GET/PATCH | Admin | List bookings (with filters), export CSV, update status |
| /api/admin/flights | GET/POST | Admin | List, create flight |
| /api/admin/flights/[id] | GET/PUT/DELETE | Admin | Get, update, delete flight |
| /api/admin/hotels | GET/POST | Admin | List, create hotel |
| /api/admin/hotels/[id] | GET/PUT/DELETE | Admin | Get, update, delete hotel |
| /api/admin/tours | GET/POST | Admin | List, create tour |
| /api/admin/tours/[id] | GET/PUT/DELETE | Admin | Get, update, delete tour |
| /api/admin/packages | GET/POST | Admin | List, create package |
| /api/admin/packages/[id] | GET/PUT/DELETE | Admin | Get, update, delete package |
| /api/admin/analytics | GET | Admin | Analytics data for charts |
| /api/admin/contacts | GET/PATCH | Admin | Contact messages, mark replied |

---

## 6. Data Models (MongoDB / Mongoose)

| Model | Purpose |
|-------|---------|
| User | name, email, password (hashed), role (user/admin/superadmin), isBlocked, isVerified, resetOtp, resetOtpExpires |
| Booking | userId, bookingId, type, item, source (api/manual), subtotal, tax, total, currency, priceBreakdown, status, paymentOrderId, paymentId |
| Listing | type (flight/hotel/tour/package), data (flexible); used for admin-created content |
| Settings | businessModel, commissionPercentage, markupPercentage, taxPercentage, currency (single doc) |
| Contact | name, email, subject, message; contact form submissions |
| Offer | Offers/campaigns for display |
| Coupon | Coupon codes for discounts |
| Newsletter | Newsletter signups (if used) |
| Wishlist | User wishlist items |
| Notification | In-app notifications |
| Review | Reviews (if used) |
| AffiliateClick | Affiliate click tracking |

---

## 7. Environment Variables

Required in `.env.local` (see `.env.example`):

- **MONGODB_URI** – MongoDB connection string (direct or SRV).
- **JWT_SECRET** – Secret for signing JWTs (e.g. 64-char hex).
- **JWT_EXPIRES_IN** – Optional; default 7d.

Email (contact form, welcome, forgot-password OTP):

- **SMTP_MAIL_FROM** – Sender email (e.g. Gmail address).
- **SMTP_APP_PASSWORD** – Gmail App Password (or GMAIL_APP_PASSWORD).

Payments:

- **RAZORPAY_KEY_ID**, **RAZORPAY_KEY_SECRET** – Razorpay keys.

Admin (seed script):

- **ADMIN_EMAIL**, **ADMIN_PASSWORD** – First admin account.
- **ADMIN_SUPERADMIN** – Set to true to create superadmin instead of admin.

Optional (travel APIs):

- **AMADEUS_API_KEY**, **AMADEUS_API_SECRET** (or AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET).
- **SKYSCANNER_API_KEY** or **RAPIDAPI_KEY**.
- **KAYAK_API_KEY**, **KAYAK_AFFILIATE_ID**.
- **BOOKING_API_KEY** or **BOOKING_PARTNER_ID**.
- **TRAVEL_PROVIDER** – mock | amadeus | skyscanner | booking (used by apiProviders).

---

## 8. What Needs to Be Added

### 8.1 Flights and hotels (advanced)

- Separate collections: **manualFlights** and **apiFlightsCache** (or equivalent) instead of only Listing for flights.
- Manual flights: full CRUD with fields (airline, flight number, from, to, departure, arrival, price, seats, cabin, baggage, refund policy, featured, status).
- API flights: no edit; allow markup, hide from listing, feature on homepage. Cache API results in apiFlightsCache.
- Hybrid mode: show API results first, then featured manual flights. Same idea for hotels (manual CRUD + API cache + markup/feature/hide).

### 8.2 Tours, packages, visa, cars, bus, cruise

- Full CRUD with image upload (not only URL), SEO fields (meta title, meta description), featured toggle, status toggle, pricing rules, discount system. Currently CRUD exists for tours/packages via Listing; extend with these fields and media upload.

### 8.3 Content management (CMS)

- Admin-editable content: home hero, homepage banners, offers section, testimonials, newsletter text, footer, contact info. New collections or single “SiteContent” doc and admin UI to edit.

### 8.4 Offers and promotions

- Admin UI to create/edit coupons: code, discount type (percent/fixed), expiry, usage limit, applicable categories. Apply coupon in booking/payment flow. Coupon model and validate API exist; wire to checkout and admin.

### 8.5 Analytics extensions

- Conversion rate, API vs manual revenue split, most searched routes, abandoned bookings. Current analytics API has revenue and booking types; add these metrics and admin charts.

### 8.6 Theme

- Logo upload, favicon upload, font selection, dark/light mode toggle. Current theme page supports built-in and custom primary color only.

### 8.7 Security and robustness

- Input sanitization on all user inputs; validation on every API body.
- Optional: Redis (or similar) for rate limiting in multi-instance production instead of in-memory map.
- Optional: CSRF for state-changing APIs if not relying only on same-site cookie.

### 8.8 User-facing

- Reset password from admin (e.g. “Send reset link” in user row). Currently only self-service forgot-password exists.
- Optional: email verification flow (isVerified) with verification link.

---

## 9. Hosting and Deployment

### 9.1 Recommended setup

- **Frontend and API**: Vercel (Next.js). Connect Git repo; build command `next build`; output is default. Set all environment variables in Vercel project settings (or via Vercel CLI). Use production Node version supported by Vercel (e.g. 18.x).
- **Database**: MongoDB Atlas. Create cluster, get connection string, whitelist Vercel IPs or use 0.0.0.0/0 for serverless (prefer VPC/peering if available). Store connection string in `MONGODB_URI`. For “bad auth” or timeouts, use direct connection string (non-SRV) if needed.
- **Email**: Gmail with App Password in `SMTP_MAIL_FROM` and `SMTP_APP_PASSWORD`. Or use SendGrid/Mailgun and adjust `lib/email.js`.
- **Payments**: Razorpay production keys in production env; test keys for staging.

### 9.2 Build and run

- Install: `npm install`
- Development: `npm run dev` (default port 3000)
- Production build: `npm run build`
- Production start: `npm start`
- Seed admin: `npm run seed:admin` (run once after DB is reachable; loads .env.local via script)

### 9.3 Environment variables on Vercel

Add every variable from `.env.example` that the app uses. Do not commit real secrets. In Vercel: Project > Settings > Environment Variables. Add for Production (and Preview if you want). Important:

- MONGODB_URI
- JWT_SECRET
- SMTP_MAIL_FROM, SMTP_APP_PASSWORD
- RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
- ADMIN_EMAIL, ADMIN_PASSWORD (for first deploy; can remove after seeding if desired)

After first deploy, run seed script against production DB (e.g. locally with MONGODB_URI pointing to prod, or a one-off script in CI) to create the first admin.

### 9.4 Domain and HTTPS

- Vercel provides HTTPS and default *.vercel.app domain. For custom domain: add in Vercel project settings and point DNS as instructed.
- Ensure cookie and redirects use the same domain so auth works (default config is fine for same-domain).

### 9.5 Other hosts

- **Node host (VPS, Railway, Render, etc.)**: Run `npm run build` then `npm start`. Set `PORT` if required. Expose the process on port 80/443 (or behind a reverse proxy). Set all env vars in the host’s dashboard or `.env`.
- **Docker**: Use a Dockerfile that runs `npm run build && npm start`. Pass env via `-e` or env file. Do not store secrets in the image.

### 9.6 Post-deploy checks

- Hit `/api/test-db` to confirm MongoDB connectivity.
- Log in at `/admin/login` with seeded admin.
- Test one booking flow (create order, verify payment) in test mode.
- Send a test contact form and confirm email at SMTP_MAIL_FROM.
- Confirm `/api/settings` returns the expected business model (after saving in admin at least once).

---

## 10. File Structure (main areas)

```
app/
  page.jsx, layout.jsx, globals.css
  (auth)/ login, signup, forgot-password, profile, ...
  (public)/ about, contact, terms, privacy, flights, hotels, tours, ...
  (protected)/ my-bookings, wishlist, payment, booking-summary, ...
  admin/ layout, page (dashboard), login, settings, users, bookings, flights, hotels, tours, packages, theme, analytics
  api/ auth/*, contact, settings, travel/*, payment/*, admin/*, ...
models/         (Mongoose schemas)
lib/            db, auth, jwt, email, authGuard, adminGuard, pricingEngine, travel, apiProviders, ...
components/     layout (navbar, footer), ui (card, button, dialog, ...)
store/          Zustand stores (auth, admin, theme, toast, wishlist, ...)
middleware.js   (rate limit, auth redirect, admin redirect, security headers)
scripts/        seed-admin.js
```

---

This document should be updated as new features are added or hosting choices change.
