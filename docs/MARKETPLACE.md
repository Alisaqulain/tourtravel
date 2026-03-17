# Multi-Hotel Marketplace

Production-ready hotel marketplace with **Admin**, **Hotel Owner**, and **Customer** roles.

## Product rule: separate portals

- **Customer site:** `/` (main site). Public hotel search: `/hotels`, SEO hotel page: `/hotels/[hotelSlug]`.
- **Hotel owner portal:** `/hotel` – owners must use this portal only; they do not see the public booking site.
- **Admin portal:** `/admin` – single admin panel (includes Marketplace section).

## Entry

- **Hotel owner signup:** `/hotel/signup` – full form (owner + hotel details + documents + images). Creates user and hotel with `status: "pending"`. After approval, full dashboard unlocks.
- **Customer:** `/hotels` to search, `/hotels/[slug]` for hotel detail, then book via marketplace flow.
- **Login:** `/login`; same JWT works. Navbar shows "Hotel dashboard" for hotel owners (→ `/hotel`).

## Roles

| Role        | Access |
|------------|--------|
| Admin      | `/admin` – Dashboard, Users, Bookings, **Marketplace** (Hotels, Payouts, Commission, Bookings) |
| Hotel Owner| `/hotel` – Dashboard, Hotel Profile, Rooms, Pricing, Availability, Bookings, Wallet, Reviews, Settings |
| Customer   | `/`, `/hotels`, `/hotels/[slug]`, `/marketplace/hotels` for booking flow |

## API Routes (prefix `/api/marketplace`)

### Auth
- `POST /api/marketplace/auth/register` – body: `{ name, email, password, phone?, role: 'customer'|'hotel_owner' }`

### Hotel (owner)
- `POST /api/marketplace/hotel/signup` – **public** full signup (owner + hotel in one). Creates user (role hotel_owner) and hotel (status pending). Returns auth cookie.
- `POST /api/marketplace/hotel/register` – create hotel (auth: hotel_owner; legacy flow)
- `PATCH /api/marketplace/hotel/register` – update hotel profile (auth: hotel_owner)
- `GET /api/marketplace/hotel/register` – get my hotel
- `GET /api/marketplace/hotel/rooms` – list my rooms
- `GET /api/marketplace/hotel/wallet` – wallet balance
- `GET /api/marketplace/hotel/bookings` – my bookings

### Rooms
- `POST /api/marketplace/rooms/create` – body: `{ hotelId, title, description?, pricePerNight, capacity, totalRooms }`
- `PUT /api/marketplace/rooms/update` – body: `{ roomId, ...fields }`

### Bookings (customer)
- `POST /api/marketplace/bookings/create` – body: `{ roomId, checkIn, checkOut, guests }`
- `POST /api/marketplace/bookings/create-order` – body: `{ bookingId }` → Razorpay order
- `POST /api/marketplace/payment/verify` – body: Razorpay response + bookingId

### Public
- `GET /api/marketplace/hotels` – query: `city`, `minPrice`, `maxPrice`, `rating`, `amenities`
- `GET /api/marketplace/hotels/[idOrSlug]` – hotel by ID or **slug** (SEO: use slug in `/hotels/[slug]`)
- `GET /api/marketplace/hotels/[idOrSlug]/rooms` – rooms for hotel (id or slug)

### Admin
- `GET /api/marketplace/admin/hotels` – query: `status`
- `POST /api/marketplace/admin/hotel/approve` – body: `{ hotelId, action: 'approve'|'reject'|'request_documents', rejectionReason?, adminNote? }`
- `GET /api/marketplace/admin/bookings`
- `GET /api/marketplace/admin/payouts`
- `POST /api/marketplace/admin/payout/approve` – body: `{ payoutId, action: 'approve'|'reject' }`
- `POST /api/marketplace/admin/payout/pay` – body: `{ payoutId }`
- `GET/POST /api/marketplace/admin/commission` – get/set commission %

### Payout (owner)
- `POST /api/marketplace/payout/request` – body: `{ amount }`

## Database (MongoDB)

- **User** – existing model; roles include `hotel_owner`, `customer`.
- **Hotel** – ownerId, name, **slug**, address, city, **country**, description, images, amenities, documents, **starRating**, **totalRooms**, status (`pending`|`pending_verification`|`approved`|`rejected`), **adminNote**, **isFeatured**.
- **Room** – hotelId, title, description, pricePerNight, capacity, totalRooms, availableRooms.
- **MarketplaceBooking** – userId, hotelId, roomId, checkIn, checkOut, guests, totalAmount, commission, hotelEarning, paymentStatus, bookingStatus.
- **HotelWallet** – hotelId, totalEarnings, availableBalance, pendingWithdrawals, totalWithdrawn.
- **PayoutRequest** – hotelId, amount, status (`pending`|`approved`|`paid`|`rejected`), requestDate, paidDate, adminNote.
- **CommissionSettings** – key `default`, commissionPercent.

## Payment (Razorpay)

- Customer pays platform; booking total is stored; commission and hotelEarning are computed from `CommissionSettings`.
- On successful payment: `booking.paymentStatus = 'paid'`, wallet `totalEarnings` and `availableBalance` increased by `hotelEarning`.
- Hotel requests payout → admin approves → admin marks paid → wallet `availableBalance` decreased, `totalWithdrawn` increased.

## Image storage (KVM4 / local filesystem)

Images are stored on the filesystem (no Cloudinary). Use your KVM4 volume or any local path.

- **Env:** `STORAGE_PATH` or `KVM4_STORAGE_PATH` – absolute path (e.g. `/mnt/kvm4`) or relative to project (e.g. `./storage`). Default: `./storage`.
- **Upload:** `POST /api/marketplace/upload` – `multipart/form-data` with field `file` or `image`. Optional `prefix` (e.g. `hotel`, `room`). Returns `{ url }` (e.g. `/api/storage/uploads/marketplace/2025/02/…`).
- **Serve:** `GET /api/storage/uploads/...` – serves the file. Use the returned `url` in hotel/room `images` arrays.
- Files are stored under `STORAGE_PATH/uploads/marketplace/YYYY/MM/` with unique names.

## Env

- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` for payments.
- `JWT_SECRET`, `MONGODB_URI` (same as main app).
- `STORAGE_PATH` or `KVM4_STORAGE_PATH` for image storage (optional; default `./storage`).

## Making an existing user an admin

Set `role` to `admin` or `superadmin` in the User collection so they can access `/marketplace/admin`.
