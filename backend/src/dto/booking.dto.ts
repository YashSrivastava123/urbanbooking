import { IsUUID, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ description: 'Slot ID to book' })
  @IsUUID()
  @IsNotEmpty()
  slotId: string;

  @ApiProperty({ description: 'Customer ID making the booking' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;
}

export class UpdateBookingDto {
  @ApiProperty({ 
    description: 'New booking status',
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED
  })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
} 