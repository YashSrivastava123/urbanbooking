# Urban Booking

A full-stack booking management system inspired by Urban Company.
Book service providers, manage your reservations, and experience a modern, real-time web app.

---

## 1. Project Overview

Urban Booking lets users:
- Browse and book time slots with service providers (like carpenters, electricians, etc.)
- See real-time slot availability (no double-booking)
- Review, confirm, or cancel their bookings

**Why?**  
Most booking systems are either clunky or not concurrency-safe. This project solves that with a clean UI, robust backend, and a focus on real-world usability.

---

## 2. Key Features

- **Provider-first booking flow**: Pick a provider, then a slot.
- **Real-time slot updates**: No more booking a slot that’s already gone.
- **Concurrency-safe backend**: Handles multiple users trying to book the same slot.
- **JWT authentication**: Secure login, registration, and protected APIs.
- **Modern UI/UX**: Responsive, accessible, and easy to use.
- **Clear error/loading/empty states**: No confusion for users.

---

## 3. Tech Stack

- **Frontend**: React (TypeScript), React Query, Axios, TailwindCSS
- **Backend**: NestJS (TypeScript), PostgreSQL, TypeORM
- **Database**: PostgreSQL

---

## 4. System Architecture

```
[User] ⇄ [React Frontend] ⇄ [NestJS API] ⇄ [PostgreSQL]
```
- **Frontend**: Handles all UI, state, and API calls.
- **Backend**: REST API, business logic, concurrency, and validation.
- **Database**: Stores users, providers, slots, and bookings.

---

## 5. Folder Structure

### Backend (`/backend`)
```
src/
  controllers/    # API endpoints (bookings, slots, providers, auth)
  entities/       # TypeORM models (User, Slot, Booking)
  services/       # Business logic (slot booking, user auth)
  factories/      # Factory pattern for slot/booking logic
  dto/            # DTOs for validation
  main.ts         # App entrypoint
  app.module.ts   # Main module
```

### Frontend (`/frontend`)
```
src/
  pages/          # Main pages (SlotBooking, ReviewBooking, MyBookings, Auth)
  components/     # UI components (Modal, ErrorMessage, SuccessAnimation)
  hooks/          # React Query hooks (useBookings, useProviders, etc.)
  services/       # Axios API service
  contexts/       # Auth context
  types/          # TypeScript types
  App.tsx         # Router and layout
```

---

## 6. API Reference Table

| Method | Route                                 | Description                        |
|--------|---------------------------------------|------------------------------------|
| GET    | `/api/slots`                          | List available slots               |
| GET    | `/api/slots/all`                      | List all slots (including booked)  |
| POST   | `/api/bookings`                       | Create a booking                   |
| GET    | `/api/bookings/:id`                   | Get booking details                |
| PUT    | `/api/bookings/:id`                   | Update booking status              |
| DELETE | `/api/bookings/:id`                   | Cancel booking                     |
| GET    | `/api/bookings/customer/:customerId`  | List bookings for a customer       |
| GET    | `/api/providers`                      | List all providers                 |
| POST   | `/api/auth/register`                  | Register user                      |
| POST   | `/api/auth/login`                     | Login user (returns JWT)           |

**All APIs return proper status codes and error messages. Booking APIs are protected by JWT AuthGuard.**

---

## 7. How Concurrency is Handled

- **Slot booking uses a DB transaction and row-level locking** (`SELECT ... FOR UPDATE`).
- If two users try to book the same slot, only the first succeeds; the other gets a clear error.
- Slot availability is updated in real-time on the frontend (polling every few seconds).

---

## 8. Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Backend
```bash
cd backend
cp env.example .env   # Fill in your DB credentials
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
cp .env.example .env  # Set REACT_APP_API_URL to your backend URL
npm install
npm start
```

- Visit `http://localhost:3000` to use the app.

---



