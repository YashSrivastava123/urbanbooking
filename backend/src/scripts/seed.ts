import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Slot } from '../entities/slot.entity';
import { Booking, BookingStatus } from '../entities/booking.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Slot, Booking],
  synchronize: true,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Database connected');

    // Create sample users
    const providers = await dataSource.manager.save(User, [
      {
        name: 'John Carpenter',
        email: 'john.carpenter@urban.com',
        role: UserRole.PROVIDER,
      },
      {
        name: 'Sarah Plumber',
        email: 'sarah.plumber@urban.com',
        role: UserRole.PROVIDER,
      },
      {
        name: 'Mike Electrician',
        email: 'mike.electrician@urban.com',
        role: UserRole.PROVIDER,
      },
      {
        name: 'Lisa Painter',
        email: 'lisa.painter@urban.com',
        role: UserRole.PROVIDER,
      },
      {
        name: 'David Cleaner',
        email: 'david.cleaner@urban.com',
        role: UserRole.PROVIDER,
      },
    ]);

    const customers = await dataSource.manager.save(User, [
      {
        name: 'Alice Customer',
        email: 'alice@example.com',
        role: UserRole.CUSTOMER,
      },
      {
        name: 'Bob Customer',
        email: 'bob@example.com',
        role: UserRole.CUSTOMER,
      },
    ]);

    console.log('Users created:', providers.length + customers.length);

    // Create slots for the next 7 days
    const slots: Slot[] = [];
    const startDate = new Date();
    
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);
      
      for (const provider of providers) {
        // Create slots from 9 AM to 6 PM (1 hour each)
        for (let hour = 9; hour < 18; hour++) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, 0, 0, 0);

          const slotEnd = new Date(currentDate);
          slotEnd.setHours(hour + 1, 0, 0, 0);

          slots.push({
            provider_id: provider.id,
            start_time: slotStart,
            end_time: slotEnd,
            is_available: true,
          } as Slot);
        }
      }
    }

    const savedSlots = await dataSource.manager.save(Slot, slots);
    console.log('Slots created:', savedSlots.length);

    // Create some sample bookings
    const sampleBookings = [
      {
        slot_id: savedSlots[0].id,
        customer_id: customers[0].id,
        status: BookingStatus.CONFIRMED,
      },
      {
        slot_id: savedSlots[5].id,
        customer_id: customers[1].id,
        status: BookingStatus.PENDING,
      },
    ];

    const bookings = await dataSource.manager.save(Booking, sampleBookings);
    console.log('Bookings created:', bookings.length);

    // Mark booked slots as unavailable
    for (const booking of bookings) {
      await dataSource.manager.update(Slot, booking.slot_id, { is_available: false });
    }

    console.log('Database seeded successfully!');
    console.log('\nSample data:');
    console.log('- Providers:', providers.length);
    console.log('- Customers:', customers.length);
    console.log('- Slots:', savedSlots.length);
    console.log('- Bookings:', bookings.length);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed(); 