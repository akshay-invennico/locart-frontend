# Stylist Panel — Backend API Specification

This document describes the **backend endpoints required to power the Stylist
self-service panel** in the Locart admin frontend. The frontend pages already
exist under `src/pages/stylists/**` and call the endpoints defined here via
`src/state/stylist/stylistMeService.js`. As soon as each endpoint becomes
available on the backend, the corresponding UI lights up automatically — no
frontend changes required.

> **Audience:** This README is intended to be passed to Claude Code (or any
> backend engineer) to scaffold the missing endpoints in the backend repository.
> Implement them in a separate folder/module on the backend side; the frontend
> integration is already done.

---

## 0. Conventions

- **Auth:** every endpoint below requires a valid stylist JWT (`Authorization:
  Bearer <token>`). The backend must resolve the **current stylist** from the
  token and scope every query to that stylist. The frontend never sends a
  `stylistId`.
- **Base URL:** all stylist self endpoints live under `/stylist/me/...`.
- **Success envelope:**
  ```json
  { "success": true, "data": <payload>, "message": "..." }
  ```
  The frontend uses `res.data ?? res` so either flat or nested `data` works.
- **Errors:** standard HTTP status codes. Use `404` for "not found" and `403`
  for "this resource doesn't belong to you". Validation errors use `400` with
  `{ "success": false, "message": "..." }`.
- **Not implemented:** while developing, returning `404` or `501` is fine — the
  frontend renders a graceful "Coming soon" placeholder
  (`PendingApiNotice` component).
- **Dates:** ISO 8601 (`2026-04-07`, `2026-04-07T14:30:00Z`). Times use
  24-hour `HH:mm`.
- **Pagination:** `?page=<int>&limit=<int>`; respond with
  `{ data: [...], total, page, limit }`.

---

## 1. Profile

The currently-authenticated stylist's own profile.

### `GET /stylist/me`
**Used by:** `src/pages/stylists/profile/StylistProfilePage.jsx`

**Response**
```json
{
  "success": true,
  "data": {
    "_id": "stylist_id",
    "fullName": "Jane Doe",
    "nickname": "The Loc Whisperer",
    "specialization": "LocStylist",
    "email": "jane@example.com",
    "phoneNumber": "+15551234567",
    "profile_photo": "https://cdn.../jane.jpg",
    "experience_years": "5 years",
    "about": "...",
    "services": [{ "_id": "...", "name": "Loc Retwist" }],
    "workingDays": ["Monday", "Tuesday"],
    "workingHours": { "from": "09:00", "to": "17:00" },
    "status": "Active",
    "averageRating": 4.7,
    "totalReviews": 42
  }
}
```

### `PATCH /stylist/me`
**Used by:** `StylistProfilePage.jsx` (Save Changes button)

- **Content-Type:** `multipart/form-data` (because `profile_photo` is a file)
- **Body fields** (all optional):
  - `profile_photo` (file, png/jpeg, ≤ 2 MB)
  - `fullName`, `nickname`, `specialization`
  - `email`, `phoneNumber`
  - `experience_years`, `about`

**Response:** updated profile, same shape as `GET /stylist/me`.

---

## 2. Dashboard / Analytics

### `GET /stylist/me/dashboard?range=today|week|month`
**Used by:** `src/pages/stylists/dashboard/StylistDashboardPage.jsx`

Aggregates everything shown on the stylist landing page.

**Response**
```json
{
  "success": true,
  "data": {
    "appointmentsCount": 5,
    "upcomingCount": 12,
    "earnings": 480.50,
    "averageRating": 4.7,
    "totalReviews": 42,
    "todaysSchedule": [
      {
        "_id": "appt_id",
        "client_name": "Mary Smith",
        "service_name": "Loc Retwist",
        "start_time": "10:30"
      }
    ],
    "topServices": [
      { "_id": "svc_id", "name": "Loc Retwist", "bookings": 18 }
    ]
  }
}
```

### `GET /stylist/me/earnings?range=week|month|year`
**Used by:** `src/pages/stylists/earnings/StylistEarningsPage.jsx`

**Response**
```json
{
  "success": true,
  "data": {
    "gross": 2150.00,
    "tips": 230.00,
    "pending_payout": 480.50,
    "transactions": [
      {
        "_id": "txn_id",
        "date": "2026-04-05",
        "client_name": "Mary Smith",
        "service_name": "Loc Retwist",
        "amount": 160.00,
        "commission": 96.00,
        "tip": 20.00
      }
    ]
  }
}
```

---

## 3. Appointments

All endpoints are **stylist-scoped** — the backend filters by the JWT's stylist
id. There must be no way for a stylist to read or mutate another stylist's
appointments.

### `GET /stylist/me/appointments`
**Used by:** `src/pages/stylists/appointments/StylistAppointmentsPage.jsx`

**Query params**
- `status` — comma-separated, any of `upcoming, confirmed, completed, cancelled, no-show`. Omit / "all" to return everything.
- `from`, `to` — ISO date filters
- `search` — match client name, phone, or service name
- `page`, `limit`

**Response**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "_id": "appt_id",
        "client": { "_id": "...", "name": "Mary Smith", "phone": "+1..." },
        "service": { "_id": "...", "name": "Loc Retwist", "duration": 90 },
        "date": "2026-04-08",
        "start_time": "10:30",
        "end_time": "12:00",
        "status": "upcoming",
        "notes": "...",
        "amount": 160.00
      }
    ],
    "total": 24,
    "page": 1,
    "limit": 20
  }
}
```

### `GET /stylist/me/appointments/:id`
**Used by:** future appointment-detail drawer (already wired in service file).

Returns a single appointment, same shape as the list item plus full client and
service objects.

### `POST /stylist/me/appointments`
**Used by:** `CreateAppointmentForm.jsx` ("Create Appointment" slide-panel)

Stylist-initiated walk-in / manual booking.

**Body**
```json
{
  "client_name": "Mary Smith",
  "client_phone": "+15551234567",
  "client_email": "mary@example.com",
  "service_id": "svc_id",
  "date": "2026-04-10",
  "start_time": "11:00",
  "notes": "First visit"
}
```

**Behaviour**
- Backend looks up or creates a client record by `client_phone`.
- `end_time` is derived from `service.duration`.
- The stylist on the appointment is the **authenticated stylist** (do not
  accept `stylist_id` from the client).
- `status` defaults to `upcoming`.
- Validate that the time slot does not collide with the stylist's existing
  appointments or holidays.

**Response:** the created appointment object.

### `PATCH /stylist/me/appointments/:id/status`
**Used by:** Complete / Cancel buttons on the appointments table.

**Body**
```json
{ "status": "completed", "note": "optional reason" }
```

Allowed transitions: `upcoming → completed | cancelled | no-show`.

---

## 4. Clients

### `GET /stylist/me/clients?search=...&page=&limit=`
**Used by:** `src/pages/stylists/clients/StylistClientsPage.jsx`

Returns all distinct clients who have ever booked an appointment with the
authenticated stylist.

**Response**
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "_id": "client_id",
        "name": "Mary Smith",
        "phone": "+15551234567",
        "email": "mary@example.com",
        "bookings_count": 7,
        "last_visit": "2026-03-21",
        "total_spent": 920.00
      }
    ],
    "total": 14
  }
}
```

---

## 5. Personal Availability

These endpoints expose the **stylist's own** availability — separate from the
store-wide operating hours which are still managed under `/store/...`.

### `GET /stylist/me/availability`
**Response**
```json
{
  "success": true,
  "data": {
    "workingHours": [
      { "day": "Monday", "open": "09:00", "close": "17:00", "isOpen": true },
      { "day": "Tuesday", "open": "09:00", "close": "17:00", "isOpen": true }
    ]
  }
}
```

### `PATCH /stylist/me/availability`
Body: `{ "workingHours": [ ... ] }` — same shape as the GET response.

### `GET /stylist/me/time-off`
Returns date ranges where the stylist is unavailable.
```json
{
  "success": true,
  "data": [
    { "_id": "...", "from": "2026-04-15", "to": "2026-04-18", "reason": "Vacation" }
  ]
}
```

### `POST /stylist/me/time-off`
Body: `{ "from": "...", "to": "...", "reason": "..." }`

### `DELETE /stylist/me/time-off/:id`

> ✅ Migrated. `StylistAvailabilityPage` now calls
> `/stylist/me/availability` and `/stylist/me/time-off` directly.

---

## 6. Services lookup

### `GET /stylist/me/services`
**Used by:** `CreateAppointmentForm.jsx` (service dropdown).

Returns the list of services the authenticated stylist is allowed to perform.

**Response**
```json
{
  "success": true,
  "data": [
    { "_id": "svc_id", "name": "Loc Retwist", "base_price": 160, "duration": 90 }
  ]
}
```

---

## 7. Reviews — already implemented ✅

`GET /review/stylist/:stylistId` is already used by
`src/pages/stylists/review/StylistReviewPage.jsx` via `getStylistReviews`. No
backend work required, but consider adding a self variant
`GET /stylist/me/reviews` for consistency with the rest of this spec.

---

## 8. Auth — already implemented ✅

Stylist login, forgot/reset password reuse the shared
`src/state/auth/authSlice.js` flow (`/auth/login`, `/auth/forgot-password`,
`/auth/reset-password`, `/auth/verify-reset-token`). No new work required —
just make sure stylist users have `role = "stylist"` so the frontend can route
them to `/stylists/dashboard` after login.

---

## 9. Frontend routes (already wired in `src/App.jsx`)

| Route                          | Page                                                | Status        |
| ------------------------------ | --------------------------------------------------- | ------------- |
| `/stylists/auth`               | Login / forgot / reset                              | ✅ working    |
| `/stylists/dashboard`          | Stats overview                                      | ✅ wired  |
| `/stylists/appointments`      | List + Create + status mutations                    | ✅ wired  |
| `/stylists/clients`            | Client list                                         | ✅ wired  |
| `/stylists/profile`            | View / edit own profile                             | ✅ wired  |
| `/stylists/earnings`           | Earnings & payout history                           | ✅ wired  |
| `/stylists/availability`       | Personal working hours / time off                   | ✅ wired      |
| `/stylists/review`             | Reviews & ratings                                   | ✅ working    |

---

## 10. Endpoint summary (checklist for backend)

```
# Profile
GET    /stylist/me
PATCH  /stylist/me                         (multipart/form-data)

# Dashboard / earnings
GET    /stylist/me/dashboard?range=
GET    /stylist/me/earnings?range=

# Appointments
GET    /stylist/me/appointments
GET    /stylist/me/appointments/:id
POST   /stylist/me/appointments
PATCH  /stylist/me/appointments/:id/status

# Clients
GET    /stylist/me/clients

# Personal availability
GET    /stylist/me/availability
PATCH  /stylist/me/availability
GET    /stylist/me/time-off
POST   /stylist/me/time-off
DELETE /stylist/me/time-off/:id

# Services lookup
GET    /stylist/me/services
```

All endpoints must enforce: **the authenticated user is a stylist, and every
record returned/mutated belongs to that stylist**.
