import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Slot } from '../entities/slot.entity';
import { User, UserRole } from '../entities/user.entity';
import { BookingStatus } from '../entities/booking.entity';

describe('Concurrent Booking Protection', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let testSlot: Slot;
  let testCustomer: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Create test data
    const provider = await dataSource.manager.save(User, {
      name: 'Test Provider',
      email: 'test.provider@example.com',
      role: UserRole.PROVIDER,
    });

    testCustomer = await dataSource.manager.save(User, {
      name: 'Test Customer',
      email: 'test.customer@example.com',
      role: UserRole.CUSTOMER,
    });

    const slotStart = new Date();
    slotStart.setHours(10, 0, 0, 0);

    const slotEnd = new Date();
    slotEnd.setHours(11, 0, 0, 0);

    testSlot = await dataSource.manager.save(Slot, {
      provider_id: provider.id,
      start_time: slotStart,
      end_time: slotEnd,
      is_available: true,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Reset slot availability before each test
    await dataSource.manager.update(Slot, testSlot.id, { is_available: true });
    // Clear any existing bookings for this slot
    await dataSource.manager.delete('bookings', { slot_id: testSlot.id });
  });

  it('should handle concurrent booking requests correctly', async () => {
    const bookingRequests = Array(5).fill(null).map(() => ({
      slotId: testSlot.id,
      customerId: testCustomer.id,
    }));

    // Send 5 concurrent booking requests
    const promises = bookingRequests.map(() =>
      request(app.getHttpServer())
        .post('/api/bookings')
        .send(bookingRequests[0])
        .expect((res) => {
          // Only one should succeed (201), others should fail (409)
          return res.status === 201 || res.status === 409;
        })
    );

    const results = await Promise.allSettled(promises);
    
    // Count successful bookings
    const successfulBookings = results.filter(
      (result) => result.status === 'fulfilled' && 
      (result as any).value?.status === 201
    ).length;

    // Count failed bookings
    const failedBookings = results.filter(
      (result) => result.status === 'fulfilled' && 
      (result as any).value?.status === 409
    ).length;

    // Verify only one booking was created
    expect(successfulBookings).toBe(1);
    expect(failedBookings).toBe(4);

    // Verify slot is no longer available
    const updatedSlot = await dataSource.manager.findOne(Slot, {
      where: { id: testSlot.id }
    });
    expect(updatedSlot?.is_available).toBe(false);

    // Verify only one booking exists
    const bookings = await dataSource.manager.find('bookings', {
      where: { slot_id: testSlot.id }
    });
    expect(bookings).toHaveLength(1);
  });

  it('should prevent double booking of the same slot', async () => {
    // Create first booking
    await request(app.getHttpServer())
      .post('/api/bookings')
      .send({
        slotId: testSlot.id,
        customerId: testCustomer.id,
      })
      .expect(201);

    // Try to book the same slot again
    await request(app.getHttpServer())
      .post('/api/bookings')
      .send({
        slotId: testSlot.id,
        customerId: testCustomer.id,
      })
      .expect(409);
  });

  it('should allow booking after cancellation', async () => {
    // Create booking
    const bookingResponse = await request(app.getHttpServer())
      .post('/api/bookings')
      .send({
        slotId: testSlot.id,
        customerId: testCustomer.id,
      })
      .expect(201);

    const bookingId = bookingResponse.body.id;

    // Cancel booking
    await request(app.getHttpServer())
      .delete(`/api/bookings/${bookingId}`)
      .expect(200);

    // Verify slot is available again
    const updatedSlot = await dataSource.manager.findOne(Slot, {
      where: { id: testSlot.id }
    });
    expect(updatedSlot?.is_available).toBe(true);

    // Book the slot again
    await request(app.getHttpServer())
      .post('/api/bookings')
      .send({
        slotId: testSlot.id,
        customerId: testCustomer.id,
      })
      .expect(201);
  });
}); 