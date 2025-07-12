import { SlotFactory } from '../factories/slot.factory';
import { Slot } from '../entities/slot.entity';
export declare class SlotsService {
    private readonly slotFactory;
    constructor(slotFactory: SlotFactory);
    getAvailableSlots(date: Date, providerId?: string, limit?: number, offset?: number): Promise<Slot[]>;
    createSlotsForProvider(providerId: string, startDate: Date, endDate: Date): Promise<Slot[]>;
    getSlotsByProvider(providerId: string, date?: Date): Promise<Slot[]>;
    getAllSlotsForProviderAndDate(date: Date, providerId: string): Promise<Slot[]>;
}
