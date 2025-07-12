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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotsService = void 0;
const common_1 = require("@nestjs/common");
const slot_factory_1 = require("../factories/slot.factory");
let SlotsService = class SlotsService {
    constructor(slotFactory) {
        this.slotFactory = slotFactory;
    }
    async getAvailableSlots(date, providerId, limit, offset) {
        const slotService = this.slotFactory.createSlotService('standard');
        return await slotService.getAvailableSlots(date, providerId, limit, offset);
    }
    async createSlotsForProvider(providerId, startDate, endDate) {
        const slotService = this.slotFactory.createSlotService('standard');
        return await slotService.createSlotsForProvider(providerId, startDate, endDate);
    }
    async getSlotsByProvider(providerId, date) {
        const slotService = this.slotFactory.createSlotService('standard');
        return await slotService.getSlotsByProvider(providerId, date);
    }
    async getAllSlotsForProviderAndDate(date, providerId) {
        const slotService = this.slotFactory.createSlotService('standard');
        return await slotService.getAllSlotsForProviderAndDate(date, providerId);
    }
};
exports.SlotsService = SlotsService;
exports.SlotsService = SlotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [slot_factory_1.SlotFactory])
], SlotsService);
//# sourceMappingURL=slots.service.js.map