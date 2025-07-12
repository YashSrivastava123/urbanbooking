import { BookingFactory } from '../factories/booking.factory';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Repository } from 'typeorm';
export declare class BookingsService {
    private readonly bookingFactory;
    private readonly bookingRepository;
    constructor(bookingFactory: BookingFactory, bookingRepository: Repository<Booking>);
    createBooking(slotId: string, customerId: string): Promise<Booking>;
    updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking>;
    cancelBooking(bookingId: string): Promise<Booking>;
    getBookingById(id: string): Promise<Booking>;
    getBookingsByCustomer(customerId: string): Promise<Booking[]>;
}
