import { SlotsService } from '../services/slots.service';
export declare class SlotsController {
    private readonly slotsService;
    constructor(slotsService: SlotsService);
    getAvailableSlots(date?: string, providerId?: string, limit?: string, offset?: string): Promise<import("../entities/slot.entity").Slot[]>;
    getAllSlots(date: string, providerId: string): Promise<import("../entities/slot.entity").Slot[]>;
}
