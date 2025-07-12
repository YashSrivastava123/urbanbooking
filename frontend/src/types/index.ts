export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export interface Slot {
  id: string;
  provider_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  provider?: User;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  slot_id: string;
  customer_id: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  version: number;
  slot?: Slot;
  customer?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  slotId: string;
  customerId: string;
}

export interface UpdateBookingRequest {
  status: BookingStatus;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface GetSlotsParams {
  date?: string;
  providerId?: string;
  limit?: number;
  offset?: number;
} 