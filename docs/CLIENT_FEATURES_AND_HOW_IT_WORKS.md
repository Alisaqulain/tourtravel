# Trips To Travels – Platform Features and How It Works

A document describing all features of the travel booking platform and how they work. Suitable for sharing with clients and stakeholders.

---

## 1. Platform Overview

Trips To Travels is a full-scale travel booking platform where users can search and book flights, hotels, tours, packages, bus trips, cruises, and premium cars. The site supports user accounts, secure payments, wishlists, notifications, and a full admin dashboard for content and analytics. The backend is production-ready with MongoDB, JWT authentication, and Razorpay integration. Travel search can use real data from external APIs (Amadeus, Skyscanner, KAYAK, Booking.com) when API keys are configured; otherwise it shows curated static listings.

---

## 2. User-Facing Features

### 2.1 Browsing and Search

- **Homepage:** Hero section, stats strip, hot deals, popular destinations, trending packages, flight and hotel highlights, bus/cruise/car sections, offers, testimonials, and newsletter signup.
- **Category pages:** Dedicated listing pages for Flights, Hotels, Tours, Bus, Cruise, Premium Cars, Visa, Packages, and Offers. Each has list and detail views.
- **Search:** Flight search supports origin, destination, date, and number of adults. Hotel search supports city/location, check-in/out dates, price and rating filters. Results come from the travel API layer when configured, with fallback to static data.
- **Detail pages:** Each bookable item (flight, hotel, tour, etc.) has a detail page with description, images, price, and a clear path to book.

### 2.2 User Account

- **Registration (Sign Up):** Users provide name, email, and password. Email is validated and must be unique. Password is hashed and never stored in plain text. On success, the user is logged in and a secure session cookie is set.
- **Login:** Email and password are validated against the database. On success, a JWT is stored in an HTTP-only cookie (secure in production). The user sees their name in the header and can access profile and bookings.
- **Profile:** Logged-in users can view their profile. The profile area can be extended to show preferences (e.g. currency) or saved details.
- **Logout:** Clears the session cookie; the user is logged out.

### 2.3 Wishlist

- **Save items:** Logged-in users can save flights, hotels, tours, packages, bus, cruise, or car items to a wishlist. Each item is stored in the database (user, item id, type, and optional snapshot).
- **Wishlist page:** At `/wishlist`, users see all saved items, with the option to remove any item. If the user is not logged in, they are prompted to sign in.
- **Navigation:** A wishlist (heart) link appears in the header when the user is logged in.

### 2.4 Notifications

- **Notification bell:** In the header, logged-in users see a bell icon. A badge shows the count of unread notifications. Clicking opens a dropdown with recent notifications (e.g. payment success, offers).
- **Notifications page:** At `/notifications`, users see the full list, can open each item, and can mark all as read. Notifications are created by the system (e.g. after a successful payment).
- **Polling:** The bell checks for new notifications periodically so the count stays up to date without a full page refresh.

### 2.5 Booking and Payment

- **Booking flow:** User selects a flight, hotel, tour, package, bus, cruise, or car, then goes to the booking summary page. Summary shows the selected item, subtotal, tax, and total. User proceeds to the payment page.
- **Payment (Razorpay):** Payment is processed via Razorpay. The server creates a Razorpay order using the booking total stored in the database (amount is never taken from the client). The user completes payment on the Razorpay-hosted flow (card/UPI/net banking). After payment, the client sends the payment details to the server.
- **Verification:** The server verifies the Razorpay signature. If valid, the booking status is set to "paid" and a success notification is created for the user. If invalid, the booking is marked "failed."
- **Booking confirmation:** After successful payment, the user is shown a confirmation and can go to "My Bookings."

### 2.6 My Bookings

- **List:** At `/my-bookings`, logged-in users see all their bookings (pending, paid, failed, cancelled) in reverse chronological order. Each row shows type, item summary, amount, and status.
- **Access:** Only the logged-in user can see their own bookings. The page is protected; unauthenticated users are redirected to login.

### 2.7 Legal and Support

- **Terms of Service:** At `/terms`. Users can read terms before using the site.
- **Privacy Policy:** At `/privacy`. Explains data collection and use.
- **Cancellation Policy:** At `/cancellation`. Explains refunds and cancellation rules.
- **Contact:** At `/contact`. Users can reach support. The footer also has Help Center, Payment & Refunds, and Safety links.
- **About:** At `/about`. Company or platform overview.

### 2.8 UI and Experience

- **Responsive layout:** The site works on desktop, tablet, and mobile. Navigation collapses to a hamburger menu on smaller screens.
- **Theme:** The site uses a dark theme by default with a configurable primary colour. Admins can change the theme from the admin panel.
- **Back to top:** A floating button appears after scrolling down; clicking it scrolls smoothly to the top.
- **Loading and empty states:** Skeleton loaders and empty-state messages are used where appropriate (e.g. wishlist, notifications) so users always see clear feedback.

---

## 3. Admin Features

### 3.1 Access

- **Admin login:** At `/admin/login`. Only users with the "admin" role can access the admin area. Others are redirected or receive an error.
- **Protection:** All admin routes and APIs check that the current user is an admin. Unauthorised access is blocked.

### 3.2 Dashboard

- **Overview:** The admin dashboard shows high-level counts: users, bookings (from the store and, when wired, from the database), and content counts (flights, hotels, tours, packages, bus, cruise, cars).
- **Quick actions:** Links to add a new flight, hotel, tour, or package, and to change the website theme. A link to Analytics is also provided.

### 3.3 Content Management

- **Flights:** List, add, edit, and delete flight entries. Data can be stored in the database (Listing model) so changes persist.
- **Hotels:** Same as flights for hotel listings.
- **Tours:** Same for tours.
- **Packages:** Same for packages.

Each content type has a list page and, where implemented, add/edit forms and delete action. The backend exposes APIs such as GET/POST for lists and GET/PUT/DELETE for a single item by id.

### 3.4 Bookings and Users

- **Bookings:** Admins can view all bookings in the system. The list can show booking id, type, customer (name/email), amount, and date. Data comes from the database.
- **Users:** Admins can view the list of registered users (e.g. name, email, role, verification status). This supports support and moderation.

### 3.5 Analytics

- **Analytics page:** At `/admin/analytics`. Shows charts powered by Recharts:
  - **Monthly revenue and bookings:** Bar chart of revenue and booking count per month for the last six months.
  - **Booking types:** Pie chart of bookings by type (Flight, Hotel, Tour, etc.).
  - **Affiliate clicks:** Summary of clicks by provider (e.g. Skyscanner, KAYAK, Booking).
- **Stats API:** The dashboard and analytics use an admin stats API that returns total users, total bookings, paid bookings, pending bookings, and total revenue. Analytics API returns the above chart data.

### 3.6 Theme

- **Theme page:** Admins can change the site theme (primary colour and related palette). Options include default and several presets. Changes are stored and applied across the site for all users.

---

## 4. Backend and Technical Features

### 4.1 Authentication and Security

- **JWT:** Sessions use JSON Web Tokens. The token is stored in an HTTP-only cookie so JavaScript cannot read it, reducing XSS risk. Cookie is marked secure in production and uses SameSite.
- **Password hashing:** Passwords are hashed with bcrypt before storage. They are never returned in API responses.
- **Protected routes:** Middleware protects routes such as profile, my-bookings, booking-summary, and payment. Unauthenticated users are redirected to login. Admin routes require an admin role.
- **Rate limiting:** API routes are rate-limited per IP to reduce abuse (e.g. 100 requests per minute per IP).
- **Security headers:** The app sets headers such as X-Frame-Options, X-Content-Type-Options, and X-XSS-Protection where applicable.

### 4.2 Database (MongoDB)

- **Models:** User (name, email, hashed password, role, verification), Booking (user, type, item snapshot, amounts, status, payment ids), Wishlist, Notification, Review (with status for moderation), Contact, Newsletter, Listing (for admin-managed content), AffiliateClick, Coupon.
- **Indexes:** Key fields (e.g. email, userId, bookingId, status) are indexed for fast queries.
- **Connection:** A single shared connection is used to avoid exhausting the database in development.

### 4.3 Payment (Razorpay)

- **Create order:** The client requests an order with a booking id. The server loads the booking from the database, verifies it belongs to the user and is pending, then computes the amount from stored subtotal and tax (never from the client). A Razorpay order is created for that amount and the booking is updated with the order id.
- **Verify:** The client sends Razorpay order id, payment id, and signature. The server verifies the signature. On success, the booking is marked paid and a notification is created; on failure, the booking can be marked failed.

### 4.4 Travel Search and APIs

- **Unified travel layer:** The backend has a pluggable travel layer. It can use Amadeus (flights and hotels), and placeholders for Skyscanner, KAYAK, and Booking.com. Which provider is used is driven by environment variables (API keys).
- **APIs used by the frontend:** GET `/api/travel/flights` and GET `/api/travel/hotels` (and optionally cars) accept query parameters (e.g. origin, destination, date for flights; city, dates, filters for hotels). The server calls the configured provider, normalises the response, and returns a consistent format. If no provider is configured or no results are returned, the app can fall back to static data.
- **Affiliate tracking:** When a user is sent to an external partner (e.g. Skyscanner, KAYAK), the frontend can call POST `/api/affiliate/track` with provider and item id. Clicks are stored for analytics and revenue reporting.

### 4.5 Coupons

- **Validation:** POST `/api/coupons/validate` accepts a coupon code and order amount. The server checks that the coupon exists, is active, not expired, under usage limit, and that the order meets the minimum amount. It returns whether the coupon is valid and the discount amount (percentage or fixed). The actual application of the discount and increment of usage is done when the booking is completed (e.g. in the payment or order flow).

### 4.6 SEO and Discoverability

- **Sitemap:** The app can generate a sitemap (e.g. at `/sitemap.xml`) listing main public URLs. The base URL is configurable via environment variable.
- **Robots:** A robots.txt can be generated that allows indexing of public pages and disallows admin, API, and private user pages.
- **Metadata and JSON-LD:** Helpers exist to build page titles, descriptions, Open Graph and Twitter tags, and structured data (e.g. product, breadcrumb) for detail pages so search engines can understand and display the site better.

---

## 5. How Key Flows Work (End to End)

### 5.1 New User Registers and Logs In

1. User opens Sign Up, enters name, email, and password.
2. Browser sends the data to POST `/api/auth/signup`. Server validates input (e.g. with Zod), checks that the email is not already registered, hashes the password, creates a User with role "user," generates a JWT, and sets an HTTP-only cookie with the token. Response includes user info (no password).
3. The frontend updates its state so the user appears logged in and can navigate to profile or bookings.
4. For future visits, the frontend can call GET `/api/auth/me` (with the cookie). If the token is valid, the server returns the current user; otherwise it returns null. Login flow is similar: POST `/api/auth/login` with email and password; server compares password with the hash and, on success, sets the same cookie.

### 5.2 User Searches for Flights and Sees Results

1. User is on the Flights page and enters origin, destination, date, and adults (or leaves defaults).
2. The frontend calls GET `/api/travel/flights` with these as query parameters.
3. The server uses the travel layer: if an API key (e.g. Amadeus) is set, it calls that provider, normalises the response, and returns a list of flights (id, airline, departure, arrival, duration, price, currency). If no provider or no results, it may return static data.
4. The frontend displays the list. User can click a flight to open its detail page.

### 5.3 User Books and Pays

1. User selects a flight (or hotel, etc.) and clicks to book. They are taken to the booking summary, which shows the item and total (subtotal + tax).
2. Frontend sends POST `/api/bookings` with type, item snapshot, subtotal, tax, total, and currency. Server ensures the user is logged in, validates the payload, generates a unique booking id, and creates a Booking with status "pending."
3. Frontend requests payment: POST `/api/payment/create-order` with the booking id. Server loads that booking, verifies it belongs to the user and is pending, recalculates amount from stored subtotal and tax, creates a Razorpay order for that amount, and returns the order id and Razorpay key to the frontend.
4. User completes payment on Razorpay (card/UPI/net banking). Razorpay returns payment details to the frontend.
5. Frontend sends POST `/api/payment/verify` with Razorpay order id, payment id, signature, and booking id. Server verifies the signature. If valid, it updates the booking to "paid," stores payment ids, and creates a "Payment successful" notification for the user. Response indicates success.
6. User is shown the booking confirmation and can go to My Bookings to see the paid booking.

### 5.4 User Uses Wishlist

1. On a detail page (when the feature is wired), the user clicks the heart to add the item. Frontend calls POST `/api/wishlist` with item id, type (e.g. flight, hotel), and optional snapshot. Server creates a Wishlist document for that user and item.
2. To remove, frontend calls DELETE `/api/wishlist` with the same item id and type. Server deletes that wishlist entry.
3. On the Wishlist page, frontend calls GET `/api/wishlist`. Server returns all wishlist items for the user. The page lists them and allows removal. To show whether an item is already saved, the frontend can call GET `/api/wishlist/check?itemId=...&type=...` and show a filled or outline heart.

### 5.5 Admin Views Bookings and Analytics

1. Admin logs in at `/admin/login`. Server validates credentials and role; if the user is an admin, the session cookie is set.
2. Admin goes to Bookings. Frontend calls GET `/api/admin/bookings`. Server returns all bookings (with user name/email populated). The list is shown in a table.
3. Admin goes to Analytics. Frontend calls GET `/api/admin/analytics`. Server aggregates bookings by month (revenue, count), by type, and affiliate clicks by provider, and returns the data. The frontend renders bar and pie charts (e.g. Recharts). Summary cards show total revenue, total paid bookings, and total affiliate clicks.

---

## 6. What the Client Gets

- A single, cohesive travel booking product: browse, search, account, wishlist, book, pay, and manage bookings.
- Secure authentication and payment (Razorpay), with amount always validated on the server.
- Optional integration with real travel APIs (Amadeus and others) for live inventory; otherwise curated static data.
- Admin panel to manage content (flights, hotels, tours, packages), view bookings and users, change theme, and view analytics (revenue, booking types, affiliate clicks).
- Wishlist and in-app notifications for better engagement.
- Foundation for coupons, affiliate tracking, and SEO (sitemap, robots, metadata, JSON-LD).
- A clear, professional document (this file) that describes every feature and how the main flows work, for handover to the client.

---

*Document version: 1.0. For technical implementation details, see the codebase and UPGRADE_SUMMARY.md.*
