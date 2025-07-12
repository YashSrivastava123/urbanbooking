"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const slot_entity_1 = require("../entities/slot.entity");
const booking_entity_1 = require("../entities/booking.entity");
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [user_entity_1.User, slot_entity_1.Slot, booking_entity_1.Booking],
    synchronize: true,
});
async function seed() {
    try {
        await dataSource.initialize();
        console.log('Database connected');
        const providers = await dataSource.manager.save(user_entity_1.User, [
            {
                name: 'John Carpenter',
                email: 'john.carpenter@urban.com',
                role: user_entity_1.UserRole.PROVIDER,
            },
            {
                name: 'Sarah Plumber',
                email: 'sarah.plumber@urban.com',
                role: user_entity_1.UserRole.PROVIDER,
            },
            {
                name: 'Mike Electrician',
                email: 'mike.electrician@urban.com',
                role: user_entity_1.UserRole.PROVIDER,
            },
            {
                name: 'Lisa Painter',
                email: 'lisa.painter@urban.com',
                role: user_entity_1.UserRole.PROVIDER,
            },
            {
                name: 'David Cleaner',
                email: 'david.cleaner@urban.com',
                role: user_entity_1.UserRole.PROVIDER,
            },
        ]);
        const customers = await dataSource.manager.save(user_entity_1.User, [
            {
                name: 'Alice Customer',
                email: 'alice@example.com',
                role: user_entity_1.UserRole.CUSTOMER,
            },
            {
                name: 'Bob Customer',
                email: 'bob@example.com',
                role: user_entity_1.UserRole.CUSTOMER,
            },
        ]);
        console.log('Users created:', providers.length + customers.length);
        const slots = [];
        const startDate = new Date();
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + day);
            for (const provider of providers) {
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
                    });
                }
            }
        }
        const savedSlots = await dataSource.manager.save(slot_entity_1.Slot, slots);
        console.log('Slots created:', savedSlots.length);
        const sampleBookings = [
            {
                slot_id: savedSlots[0].id,
                customer_id: customers[0].id,
                status: booking_entity_1.BookingStatus.CONFIRMED,
            },
            {
                slot_id: savedSlots[5].id,
                customer_id: customers[1].id,
                status: booking_entity_1.BookingStatus.PENDING,
            },
        ];
        const bookings = await dataSource.manager.save(booking_entity_1.Booking, sampleBookings);
        console.log('Bookings created:', bookings.length);
        for (const booking of bookings) {
            await dataSource.manager.update(slot_entity_1.Slot, booking.slot_id, { is_available: false });
        }
        console.log('Database seeded successfully!');
        console.log('\nSample data:');
        console.log('- Providers:', providers.length);
        console.log('- Customers:', customers.length);
        console.log('- Slots:', savedSlots.length);
        console.log('- Bookings:', bookings.length);
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    finally {
        await dataSource.destroy();
    }
}
seed();
//# sourceMappingURL=seed.js.map