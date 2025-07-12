import { Repository } from 'typeorm';
import { Slot } from '../entities/slot.entity';
import { User } from '../entities/user.entity';
export interface ISlotService {
    getAvailableSlots(date: Date, providerId?: string, limit?: number, offset?: number): Promise<Slot[]>;
    createSlotsForProvider(providerId: string, startDate: Date, endDate: Date): Promise<Slot[]>;
    getSlotsByProvider(providerId: string, date?: Date): Promise<Slot[]>;
    getAllSlotsForProviderAndDate(date: Date, providerId: string): Promise<Slot[]>;
}
export declare class StandardSlotService implements ISlotService {
    private slotRepository;
    private userRepository;
    constructor(slotRepository: Repository<Slot>, userRepository: Repository<User>);
    getAvailableSlots(date: Date, providerId?: string, limit?: number, offset?: number): Promise<Slot[]>;
    createSlotsForProvider(providerId: string, startDate: Date, endDate: Date): Promise<Slot[]>;
    getSlotsByProvider(providerId: string, date?: Date): Promise<Slot[]>;
    getAllSlotsForProviderAndDate(date: Date, providerId: string): Promise<Slot[]>;
}
export declare class SlotFactory {
    private standardSlotService;
    constructor(standardSlotService: StandardSlotService);
    createSlotService(type?: string): ISlotService;
}
