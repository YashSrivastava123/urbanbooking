import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Slot } from '../entities/slot.entity';
export interface IBookingService {
    createBooking(slotId: string, customerId: string): Promise<Booking>;
    updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking>;
    cancelBooking(bookingId: string): Promise<Booking>;
    getBookingById(bookingId: string): Promise<Booking>;
    getBookingsByCustomer(customerId: string): Promise<Booking[]>;
}
export declare class StandardBookingService implements IBookingService {
    private bookingRepository;
    private slotRepository;
    private dataSource;
    constructor(bookingRepository: Repository<Booking>, slotRepository: Repository<Slot>, dataSource: DataSource);
    createBooking(slotId: string, customerId: string): Promise<Booking>;
    updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking>;
    cancelBooking(bookingId: string): Promise<Booking>;
    getBookingById(bookingId: string): Promise<Booking>;
    getBookingsByCustomer(customerId: string): Promise<Booking[]>;
}
export declare class BookingFactory {
    private standardBookingService;
    constructor(standardBookingService: StandardBookingService);
    createBookingService(type?: string): IBookingService;
}
