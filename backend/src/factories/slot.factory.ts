import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Slot } from '../entities/slot.entity';
import { User, UserRole } from '../entities/user.entity';

export interface ISlotService {
  getAvailableSlots(date: Date, providerId?: string, limit?: number, offset?: number): Promise<Slot[]>;
  createSlotsForProvider(providerId: string, startDate: Date, endDate: Date): Promise<Slot[]>;
  getSlotsByProvider(providerId: string, date?: Date): Promise<Slot[]>;
  getAllSlotsForProviderAndDate(date: Date, providerId: string): Promise<Slot[]>;
}

@Injectable()
export class StandardSlotService implements ISlotService {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAvailableSlots(date: Date, providerId?: string, limit?: number, offset?: number): Promise<Slot[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const queryBuilder = this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.provider', 'provider')
      .where('slot.start_time >= :startOfDay', { startOfDay })
      .andWhere('slot.start_time <= :endOfDay', { endOfDay })
      .andWhere('slot.is_available = :isAvailable', { isAvailable: true });

    if (providerId) {
      queryBuilder.andWhere('slot.provider_id = :providerId', { providerId });
    }
    if (typeof limit === 'number') {
      queryBuilder.limit(limit);
    }
    if (typeof offset === 'number') {
      queryBuilder.offset(offset);
    }

    return await queryBuilder
      .orderBy('slot.start_time', 'ASC')
      .getMany();
  }

  async createSlotsForProvider(providerId: string, startDate: Date, endDate: Date): Promise<Slot[]> {
    // Verify provider exists
    const provider = await this.userRepository.findOne({
      where: { id: providerId, role: UserRole.PROVIDER }
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    const slots: Slot[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Create slots from 9 AM to 6 PM (1 hour each)
      for (let hour = 9; hour < 18; hour++) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(hour, 0, 0, 0);

        const slotEnd = new Date(currentDate);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        const slot = this.slotRepository.create({
          provider_id: providerId,
          start_time: slotStart,
          end_time: slotEnd,
          is_available: true
        });

        slots.push(slot);
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return await this.slotRepository.save(slots);
  }

  async getSlotsByProvider(providerId: string, date?: Date): Promise<Slot[]> {
    const queryBuilder = this.slotRepository
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.provider', 'provider')
      .where('slot.provider_id = :providerId', { providerId });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      queryBuilder
        .andWhere('slot.start_time >= :startOfDay', { startOfDay })
        .andWhere('slot.start_time <= :endOfDay', { endOfDay });
    }

    return await queryBuilder
      .orderBy('slot.start_time', 'ASC')
      .getMany();
  }

  async getAllSlotsForProviderAndDate(date: Date, providerId: string): Promise<Slot[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return await this.slotRepository.find({
      where: {
        provider_id: providerId,
        start_time: Between(startOfDay, endOfDay),
      },
      order: { start_time: 'ASC' },
      relations: ['provider'],
    });
  }
}

@Injectable()
export class SlotFactory {
  constructor(
    private standardSlotService: StandardSlotService,
  ) {}

  createSlotService(type: string = 'standard'): ISlotService {
    switch (type) {
      case 'standard':
        return this.standardSlotService;
      // Future slot service types can be added here
      default:
        return this.standardSlotService;
    }
  }
} 