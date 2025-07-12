import { Injectable } from '@nestjs/common';
import { SlotFactory } from '../factories/slot.factory';
import { Slot } from '../entities/slot.entity';

@Injectable()
export class SlotsService {
  constructor(private readonly slotFactory: SlotFactory) {}

  async getAvailableSlots(date: Date, providerId?: string, limit?: number, offset?: number): Promise<Slot[]> {
    const slotService = this.slotFactory.createSlotService('standard');
    return await slotService.getAvailableSlots(date, providerId, limit, offset);
  }

  async createSlotsForProvider(
    providerId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Slot[]> {
    const slotService = this.slotFactory.createSlotService('standard');
    return await slotService.createSlotsForProvider(providerId, startDate, endDate);
  }

  async getSlotsByProvider(providerId: string, date?: Date): Promise<Slot[]> {
    const slotService = this.slotFactory.createSlotService('standard');
    return await slotService.getSlotsByProvider(providerId, date);
  }

  async getAllSlotsForProviderAndDate(date: Date, providerId: string) {
    const slotService = this.slotFactory.createSlotService('standard');
    return await slotService.getAllSlotsForProviderAndDate(date, providerId);
  }
} 