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

  @Column('text', { default: '[]' })
  sectors: string;

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

  @Column('text', { nullable: true })
  kpiSummary: string;

  @Column('text', { default: '[]' })
  locations: string;

  @Column({ nullable: true })
  pitchDeckUrl: string;

  @Column('text', { nullable: true })
  pitchEmbedding: string;

  @Column('text', { nullable: true })
  founders: string;

  @Column('text', { default: '[]' })
  valueAddNeeds: string;

  @Column('text', { default: '[]' })
  nonNegotiables: string;

  @Column('text', { nullable: true })
  references: string;

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
