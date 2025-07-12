"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const slots_controller_1 = require("./controllers/slots.controller");
const bookings_controller_1 = require("./controllers/bookings.controller");
const auth_controller_1 = require("./controllers/auth.controller");
const slots_service_1 = require("./services/slots.service");
const bookings_service_1 = require("./services/bookings.service");
const auth_service_1 = require("./services/auth.service");
const slot_factory_1 = require("./factories/slot.factory");
const booking_factory_1 = require("./factories/booking.factory");
const user_entity_1 = require("./entities/user.entity");
const slot_entity_1 = require("./entities/slot.entity");
const booking_entity_1 = require("./entities/booking.entity");
const providers_controller_1 = require("./controllers/providers.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                entities: [user_entity_1.User, slot_entity_1.Slot, booking_entity_1.Booking],
                synchronize: process.env.NODE_ENV === 'development',
                logging: process.env.NODE_ENV === 'development',
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, slot_entity_1.Slot, booking_entity_1.Booking]),
        ],
        controllers: [slots_controller_1.SlotsController, bookings_controller_1.BookingsController, auth_controller_1.AuthController, providers_controller_1.ProvidersController],
        providers: [
            slots_service_1.SlotsService,
            bookings_service_1.BookingsService,
            auth_service_1.AuthService,
            slot_factory_1.SlotFactory,
            slot_factory_1.StandardSlotService,
            booking_factory_1.BookingFactory,
            booking_factory_1.StandardBookingService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map