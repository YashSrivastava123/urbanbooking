import { Injectable } from '@nestjs/common';
import { BookingFactory } from '../factories/booking.factory';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingFactory: BookingFactory,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async createBooking(slotId: string, customerId: string): Promise<Booking> {
    const bookingService = this.bookingFactory.createBookingService('standard');
    return await bookingService.createBooking(slotId, customerId);
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    const bookingService = this.bookingFactory.createBookingService('standard');
    return await bookingService.updateBookingStatus(bookingId, status);
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    const bookingService = this.bookingFactory.createBookingService('standard');
    return await bookingService.cancelBooking(bookingId);
  }

  async getBookingById(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['slot', 'customer', 'slot.provider'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    const bookingService = this.bookingFactory.createBookingService('standard');
    return await bookingService.getBookingsByCustomer(customerId);
  }
} 