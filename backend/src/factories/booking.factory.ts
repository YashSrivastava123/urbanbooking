import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class StandardBookingService implements IBookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
    private dataSource: DataSource,
  ) {}

  async createBooking(slotId: string, customerId: string): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if slot exists and is available
      const slot = await queryRunner.manager.findOne(Slot, {
        where: { id: slotId, is_available: true },
        lock: { mode: 'pessimistic_write' }
      });

      if (!slot) {
        throw new Error('Slot not available or does not exist');
      }

      // Create booking
      const booking = queryRunner.manager.create(Booking, {
        slot_id: slotId,
        customer_id: customerId,
        status: BookingStatus.PENDING
      });

      const savedBooking = await queryRunner.manager.save(Booking, booking);

      // Mark slot as unavailable
      await queryRunner.manager.update(Slot, slotId, { is_available: false });

      await queryRunner.commitTransaction();
      return savedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId }
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = status;
    return await this.bookingRepository.save(booking);
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booking = await queryRunner.manager.findOne(Booking, {
        where: { id: bookingId }
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      booking.status = BookingStatus.CANCELLED;
      const updatedBooking = await queryRunner.manager.save(Booking, booking);

      // Mark slot as available again
      await queryRunner.manager.update(Slot, booking.slot_id, { is_available: true });

      await queryRunner.commitTransaction();
      return updatedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    return await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['slot', 'customer', 'slot.provider']
    });
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { customer_id: customerId },
      relations: ['slot', 'slot.provider'],
      order: { created_at: 'DESC' }
    });
  }
}

@Injectable()
export class BookingFactory {
  constructor(
    private standardBookingService: StandardBookingService,
  ) {}

  createBookingService(type: string = 'standard'): IBookingService {
    switch (type) {
      case 'standard':
        return this.standardBookingService;
      // Future booking service types can be added here
      default:
        return this.standardBookingService;
    }
  }
} 