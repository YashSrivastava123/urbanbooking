import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
  VersionColumn
} from 'typeorm';
import { User } from './user.entity';
import { Slot } from './slot.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

@Entity('bookings')
// Removed unique constraint to allow multiple bookings per slot (for testing)
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'slot_id' })
  slot_id: string;

  @Column({ type: 'uuid', name: 'customer_id' })
  customer_id: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @VersionColumn()
  version: number; // For optimistic locking

  // Relations
  @ManyToOne(() => Slot, slot => slot.bookings)
  @JoinColumn({ name: 'slot_id' })
  slot: Slot;

  @ManyToOne(() => User, user => user.bookings)
  @JoinColumn({ name: 'customer_id' })
  customer: User;
} 