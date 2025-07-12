"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../app.module");
const typeorm_1 = require("typeorm");
const slot_entity_1 = require("../entities/slot.entity");
const user_entity_1 = require("../entities/user.entity");
describe('Concurrent Booking Protection', () => {
    let app;
    let dataSource;
    let testSlot;
    let testCustomer;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        dataSource = moduleFixture.get(typeorm_1.DataSource);
        const provider = await dataSource.manager.save(user_entity_1.User, {
            name: 'Test Provider',
            email: 'test.provider@example.com',
            role: user_entity_1.UserRole.PROVIDER,
        });
        testCustomer = await dataSource.manager.save(user_entity_1.User, {
            name: 'Test Customer',
            email: 'test.customer@example.com',
            role: user_entity_1.UserRole.CUSTOMER,
        });
        const slotStart = new Date();
        slotStart.setHours(10, 0, 0, 0);
        const slotEnd = new Date();
        slotEnd.setHours(11, 0, 0, 0);
        testSlot = await dataSource.manager.save(slot_entity_1.Slot, {
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
        await dataSource.manager.update(slot_entity_1.Slot, testSlot.id, { is_available: true });
        await dataSource.manager.delete('bookings', { slot_id: testSlot.id });
    });
    it('should handle concurrent booking requests correctly', async () => {
        const bookingRequests = Array(5).fill(null).map(() => ({
            slotId: testSlot.id,
            customerId: testCustomer.id,
        }));
        const promises = bookingRequests.map(() => request(app.getHttpServer())
            .post('/api/bookings')
            .send(bookingRequests[0])
            .expect((res) => {
            return res.status === 201 || res.status === 409;
        }));
        const results = await Promise.allSettled(promises);
        const successfulBookings = results.filter((result) => result.status === 'fulfilled' &&
            result.value?.status === 201).length;
        const failedBookings = results.filter((result) => result.status === 'fulfilled' &&
            result.value?.status === 409).length;
        expect(successfulBookings).toBe(1);
        expect(failedBookings).toBe(4);
        const updatedSlot = await dataSource.manager.findOne(slot_entity_1.Slot, {
            where: { id: testSlot.id }
        });
        expect(updatedSlot?.is_available).toBe(false);
        const bookings = await dataSource.manager.find('bookings', {
            where: { slot_id: testSlot.id }
        });
        expect(bookings).toHaveLength(1);
    });
    it('should prevent double booking of the same slot', async () => {
        await request(app.getHttpServer())
            .post('/api/bookings')
            .send({
            slotId: testSlot.id,
            customerId: testCustomer.id,
        })
            .expect(201);
        await request(app.getHttpServer())
            .post('/api/bookings')
            .send({
            slotId: testSlot.id,
            customerId: testCustomer.id,
        })
            .expect(409);
    });
    it('should allow booking after cancellation', async () => {
        const bookingResponse = await request(app.getHttpServer())
            .post('/api/bookings')
            .send({
            slotId: testSlot.id,
            customerId: testCustomer.id,
        })
            .expect(201);
        const bookingId = bookingResponse.body.id;
        await request(app.getHttpServer())
            .delete(`/api/bookings/${bookingId}`)
            .expect(200);
        const updatedSlot = await dataSource.manager.findOne(slot_entity_1.Slot, {
            where: { id: testSlot.id }
        });
        expect(updatedSlot?.is_available).toBe(true);
        await request(app.getHttpServer())
            .post('/api/bookings')
            .send({
            slotId: testSlot.id,
            customerId: testCustomer.id,
        })
            .expect(201);
    });
});
//# sourceMappingURL=concurrent-booking.test.js.map