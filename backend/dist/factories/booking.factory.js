"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingFactory = exports.StandardBookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../entities/booking.entity");
const slot_entity_1 = require("../entities/slot.entity");
let StandardBookingService = class StandardBookingService {
    constructor(bookingRepository, slotRepository, dataSource) {
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.dataSource = dataSource;
    }
    async createBooking(slotId, customerId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const slot = await queryRunner.manager.findOne(slot_entity_1.Slot, {
                where: { id: slotId, is_available: true },
                lock: { mode: 'pessimistic_write' }
            });
            if (!slot) {
                throw new Error('Slot not available or does not exist');
            }
            const booking = queryRunner.manager.create(booking_entity_1.Booking, {
                slot_id: slotId,
                customer_id: customerId,
                status: booking_entity_1.BookingStatus.PENDING
            });
            const savedBooking = await queryRunner.manager.save(booking_entity_1.Booking, booking);
            await queryRunner.manager.update(slot_entity_1.Slot, slotId, { is_available: false });
            await queryRunner.commitTransaction();
            return savedBooking;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateBookingStatus(bookingId, status) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId }
        });
        if (!booking) {
            throw new Error('Booking not found');
        }
        booking.status = status;
        return await this.bookingRepository.save(booking);
    }
    async cancelBooking(bookingId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const booking = await queryRunner.manager.findOne(booking_entity_1.Booking, {
                where: { id: bookingId }
            });
            if (!booking) {
                throw new Error('Booking not found');
            }
            booking.status = booking_entity_1.BookingStatus.CANCELLED;
            const updatedBooking = await queryRunner.manager.save(booking_entity_1.Booking, booking);
            await queryRunner.manager.update(slot_entity_1.Slot, booking.slot_id, { is_available: true });
            await queryRunner.commitTransaction();
            return updatedBooking;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getBookingById(bookingId) {
        return await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['slot', 'customer', 'slot.provider']
        });
    }
    async getBookingsByCustomer(customerId) {
        return await this.bookingRepository.find({
            where: { customer_id: customerId },
            relations: ['slot', 'slot.provider'],
            order: { created_at: 'DESC' }
        });
    }
};
exports.StandardBookingService = StandardBookingService;
exports.StandardBookingService = StandardBookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(slot_entity_1.Slot)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], StandardBookingService);
let BookingFactory = class BookingFactory {
    constructor(standardBookingService) {
        this.standardBookingService = standardBookingService;
    }
    createBookingService(type = 'standard') {
        switch (type) {
            case 'standard':
                return this.standardBookingService;
            default:
                return this.standardBookingService;
        }
    }
};
exports.BookingFactory = BookingFactory;
exports.BookingFactory = BookingFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [StandardBookingService])
], BookingFactory);
//# sourceMappingURL=booking.factory.js.map