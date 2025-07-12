import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  ValidationPipe 
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingsService } from '@/services/bookings.service';
import { CreateBookingDto, UpdateBookingDto } from '../dto/booking.dto';

@ApiTags('bookings')
@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid booking data' })
  @ApiResponse({ status: 409, description: 'Slot already booked' })
  async createBooking(@Body(ValidationPipe) createBookingDto: CreateBookingDto) {
    return await this.bookingsService.createBooking(
      createBookingDto.slotId,
      createBookingDto.customerId
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBooking(@Param('id') id: string) {
    return await this.bookingsService.getBookingById(id);
  }

  @Get('customer/:customerId')
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Bookings for customer retrieved successfully' })
  async getBookingsByCustomer(@Param('customerId') customerId: string) {
    return await this.bookingsService.getBookingsByCustomer(customerId);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async updateBooking(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBookingDto: UpdateBookingDto
  ) {
    return await this.bookingsService.updateBookingStatus(id, updateBookingDto.status);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(@Param('id') id: string) {
    return await this.bookingsService.cancelBooking(id);
  }
} 