import { Slot } from './slot.entity';
import { Booking } from './booking.entity';
export declare enum UserRole {
    PROVIDER = "provider",
    CUSTOMER = "customer"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
    slots: Slot[];
    bookings: Booking[];
}
