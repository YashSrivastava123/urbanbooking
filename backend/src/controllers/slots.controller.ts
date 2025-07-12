import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SlotsService } from '../services/slots.service';

@ApiTags('slots')
@Controller('api/slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  @ApiQuery({ name: 'date', required: false, description: 'Date to filter slots (YYYY-MM-DD)' })
  @ApiQuery({ name: 'providerId', required: false, description: 'Provider ID to filter slots' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of slots returned' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, description: 'Available slots retrieved successfully' })
  async getAvailableSlots(
    @Query('date') date?: string,
    @Query('providerId') providerId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const targetDate = date ? new Date(date) : new Date();
    return await this.slotsService.getAvailableSlots(targetDate, providerId, limit ? parseInt(limit) : undefined, offset ? parseInt(offset) : undefined);
  }

  @Get('all')
  @ApiQuery({ name: 'date', required: true, description: 'Date to filter slots (YYYY-MM-DD)' })
  @ApiQuery({ name: 'providerId', required: true, description: 'Provider ID to filter slots' })
  @ApiResponse({ status: 200, description: 'All slots for provider and date' })
  async getAllSlots(
    @Query('date') date: string,
    @Query('providerId') providerId: string
  ) {
    const targetDate = date ? new Date(date) : new Date();
    return await this.slotsService.getAllSlotsForProviderAndDate(targetDate, providerId);
  }
} 