import { User } from './user.entity';
import { Booking } from './booking.entity';
export declare class Slot {
    id: string;
    provider_id: string;
    start_time: Date;
    end_time: Date;
    is_available: boolean;
    created_at: Date;
    updated_at: Date;
    provider: User;
    bookings: Booking[];
}
