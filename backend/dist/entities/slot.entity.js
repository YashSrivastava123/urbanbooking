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
exports.Slot = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const booking_entity_1 = require("./booking.entity");
let Slot = class Slot {
};
exports.Slot = Slot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Slot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'provider_id' }),
    __metadata("design:type", String)
], Slot.prototype, "provider_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Slot.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Slot.prototype, "end_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Slot.prototype, "is_available", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Slot.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Slot.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.slots),
    (0, typeorm_1.JoinColumn)({ name: 'provider_id' }),
    __metadata("design:type", user_entity_1.User)
], Slot.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, booking => booking.slot),
    __metadata("design:type", Array)
], Slot.prototype, "bookings", void 0);
exports.Slot = Slot = __decorate([
    (0, typeorm_1.Entity)('slots'),
    (0, typeorm_1.Index)(['provider_id', 'start_time', 'end_time'])
], Slot);
//# sourceMappingURL=slot.entity.js.map