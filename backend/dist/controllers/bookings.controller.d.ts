import { BookingsService } from '@/services/bookings.service';
import { CreateBookingDto, UpdateBookingDto } from '../dto/booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(createBookingDto: CreateBookingDto): Promise<import("../entities/booking.entity").Booking>;
    getBooking(id: string): Promise<import("../entities/booking.entity").Booking>;
    getBookingsByCustomer(customerId: string): Promise<import("../entities/booking.entity").Booking[]>;
    updateBooking(id: string, updateBookingDto: UpdateBookingDto): Promise<import("../entities/booking.entity").Booking>;
    cancelBooking(id: string): Promise<import("../entities/booking.entity").Booking>;
}
