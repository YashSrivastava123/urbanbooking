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
exports.SlotFactory = exports.StandardSlotService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const slot_entity_1 = require("../entities/slot.entity");
const user_entity_1 = require("../entities/user.entity");
let StandardSlotService = class StandardSlotService {
    constructor(slotRepository, userRepository) {
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
    }
    async getAvailableSlots(date, providerId, limit, offset) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const queryBuilder = this.slotRepository
            .createQueryBuilder('slot')
            .leftJoinAndSelect('slot.provider', 'provider')
            .where('slot.start_time >= :startOfDay', { startOfDay })
            .andWhere('slot.start_time <= :endOfDay', { endOfDay })
            .andWhere('slot.is_available = :isAvailable', { isAvailable: true });
        if (providerId) {
            queryBuilder.andWhere('slot.provider_id = :providerId', { providerId });
        }
        if (typeof limit === 'number') {
            queryBuilder.limit(limit);
        }
        if (typeof offset === 'number') {
            queryBuilder.offset(offset);
        }
        return await queryBuilder
            .orderBy('slot.start_time', 'ASC')
            .getMany();
    }
    async createSlotsForProvider(providerId, startDate, endDate) {
        const provider = await this.userRepository.findOne({
            where: { id: providerId, role: user_entity_1.UserRole.PROVIDER }
        });
        if (!provider) {
            throw new Error('Provider not found');
        }
        const slots = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            for (let hour = 9; hour < 18; hour++) {
                const slotStart = new Date(currentDate);
                slotStart.setHours(hour, 0, 0, 0);
                const slotEnd = new Date(currentDate);
                slotEnd.setHours(hour + 1, 0, 0, 0);
                const slot = this.slotRepository.create({
                    provider_id: providerId,
                    start_time: slotStart,
                    end_time: slotEnd,
                    is_available: true
                });
                slots.push(slot);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return await this.slotRepository.save(slots);
    }
    async getSlotsByProvider(providerId, date) {
        const queryBuilder = this.slotRepository
            .createQueryBuilder('slot')
            .leftJoinAndSelect('slot.provider', 'provider')
            .where('slot.provider_id = :providerId', { providerId });
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            queryBuilder
                .andWhere('slot.start_time >= :startOfDay', { startOfDay })
                .andWhere('slot.start_time <= :endOfDay', { endOfDay });
        }
        return await queryBuilder
            .orderBy('slot.start_time', 'ASC')
            .getMany();
    }
    async getAllSlotsForProviderAndDate(date, providerId) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return await this.slotRepository.find({
            where: {
                provider_id: providerId,
                start_time: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            order: { start_time: 'ASC' },
            relations: ['provider'],
        });
    }
};
exports.StandardSlotService = StandardSlotService;
exports.StandardSlotService = StandardSlotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(slot_entity_1.Slot)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StandardSlotService);
let SlotFactory = class SlotFactory {
    constructor(standardSlotService) {
        this.standardSlotService = standardSlotService;
    }
    createSlotService(type = 'standard') {
        switch (type) {
            case 'standard':
                return this.standardSlotService;
            default:
                return this.standardSlotService;
        }
    }
};
exports.SlotFactory = SlotFactory;
exports.SlotFactory = SlotFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [StandardSlotService])
], SlotFactory);
//# sourceMappingURL=slot.factory.js.map