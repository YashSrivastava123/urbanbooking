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
exports.SlotsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const slots_service_1 = require("../services/slots.service");
let SlotsController = class SlotsController {
    constructor(slotsService) {
        this.slotsService = slotsService;
    }
    async getAvailableSlots(date, providerId, limit, offset) {
        const targetDate = date ? new Date(date) : new Date();
        return await this.slotsService.getAvailableSlots(targetDate, providerId, limit ? parseInt(limit) : undefined, offset ? parseInt(offset) : undefined);
    }
    async getAllSlots(date, providerId) {
        const targetDate = date ? new Date(date) : new Date();
        return await this.slotsService.getAllSlotsForProviderAndDate(targetDate, providerId);
    }
};
exports.SlotsController = SlotsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false, description: 'Date to filter slots (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'providerId', required: false, description: 'Provider ID to filter slots' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Limit number of slots returned' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, description: 'Offset for pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available slots retrieved successfully' }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('providerId')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], SlotsController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, description: 'Date to filter slots (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'providerId', required: true, description: 'Provider ID to filter slots' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All slots for provider and date' }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SlotsController.prototype, "getAllSlots", null);
exports.SlotsController = SlotsController = __decorate([
    (0, swagger_1.ApiTags)('slots'),
    (0, common_1.Controller)('api/slots'),
    __metadata("design:paramtypes", [slots_service_1.SlotsService])
], SlotsController);
//# sourceMappingURL=slots.controller.js.map