import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity('slots')
@Index(['provider_id', 'start_time', 'end_time'])
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'provider_id' })
  provider_id: string;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'boolean', default: true })
  is_available: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.slots)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @OneToMany(() => Booking, booking => booking.slot)
  bookings: Booking[];
} 