import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { StartupStage } from '@/common/enums/user-type.enum';
import { User } from './user.entity';

@Entity('startup_profiles')
export class StartupProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { array: true, default: '{}' })
  sectors: string[];

  @Column({
    type: 'enum',
    enum: StartupStage,
  })
  stage: StartupStage;

  @Column({ nullable: true })
  lastRound: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  lastRoundSize: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  valuation: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  arr: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  mrr: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  growthYoyPct: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  burnRateMonthly: number;

  @Column('integer', { nullable: true })
  runwayMonths: number;

  @Column('jsonb', { nullable: true })
  kpiSummary: Record<string, any>;

  @Column('text', { array: true, default: '{}' })
  locations: string[];

  @Column({ nullable: true })
  pitchDeckUrl: string;

  @Column('vector', { nullable: true })
  pitchEmbedding: number[];

  @Column('jsonb', { nullable: true })
  founders: Record<string, any>[];

  @Column('text', { array: true, default: '{}' })
  valueAddNeeds: string[];

  @Column('text', { array: true, default: '{}' })
  nonNegotiables: string[];

  @Column('jsonb', { nullable: true })
  references: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.startupProfile)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
