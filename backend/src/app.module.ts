import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotsController } from './controllers/slots.controller';
import { BookingsController } from './controllers/bookings.controller';
import { AuthController } from './controllers/auth.controller';
import { SlotsService } from './services/slots.service';
import { BookingsService } from './services/bookings.service';
import { AuthService } from './services/auth.service';
import { SlotFactory, StandardSlotService } from './factories/slot.factory';
import { BookingFactory, StandardBookingService } from './factories/booking.factory';
import { User } from './entities/user.entity';
import { Slot } from './entities/slot.entity';
import { Booking } from './entities/booking.entity';
import { ProvidersController } from './controllers/providers.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Slot, Booking],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([User, Slot, Booking]),
  ],
  controllers: [SlotsController, BookingsController, AuthController, ProvidersController],
  providers: [
    SlotsService,
    BookingsService,
    AuthService,
    SlotFactory,
    StandardSlotService,
    BookingFactory,
    StandardBookingService,
  ],
})
export class AppModule {} 