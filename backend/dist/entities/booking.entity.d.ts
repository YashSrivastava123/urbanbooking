import { User } from './user.entity';
import { Slot } from './slot.entity';
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled"
}
export declare class Booking {
    id: string;
    slot_id: string;
    customer_id: string;
    status: BookingStatus;
    created_at: Date;
    updated_at: Date;
    version: number;
    slot: Slot;
    customer: User;
}
