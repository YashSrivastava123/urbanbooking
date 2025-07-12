import { BookingStatus } from '../entities/booking.entity';
export declare class CreateBookingDto {
    slotId: string;
    customerId: string;
}
export declare class UpdateBookingDto {
    status: BookingStatus;
}
