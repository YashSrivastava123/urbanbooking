# Urban Booking Frontend

A modern React + TypeScript frontend for the Urban Booking Management System.

## Features

- **Slot Booking**: Browse and book available time slots
- **Booking Review**: View and manage booking details
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Type Safety**: Strict TypeScript configuration
- **Error Handling**: Comprehensive error states and user feedback

## Tech Stack

- React 18 with TypeScript (Strict)
- React Query (TanStack Query) for data fetching
- Axios for HTTP requests
- TailwindCSS for styling
- React Router for navigation

## API Endpoints Used

The frontend integrates with the following backend endpoints:

- `GET /api/slots` - Get available slots
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── SuccessMessage.tsx
├── hooks/              # React Query hooks
│   └── useBookings.ts
├── pages/              # Page components
│   ├── SlotBookingPage.tsx
│   └── ReviewBookingPage.tsx
├── services/           # API service layer
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component
├── index.tsx           # App entry point
└── index.css           # Global styles
```

## Usage

1. **Book a Slot**:
   - Select a date
   - Choose an available time slot
   - Enter your customer ID
   - Confirm the booking

2. **Review Booking**:
   - View booking details
   - Confirm or cancel pending bookings
   - See booking status and history

## Development

- The app uses React Query for efficient data management
- All API calls are logged to the console for debugging
- Error boundaries and loading states are implemented
- Responsive design works on mobile and desktop

## Backend Integration

Make sure your NestJS backend is running on `http://localhost:3001` before using the frontend. The frontend is configured to proxy requests to the backend. 