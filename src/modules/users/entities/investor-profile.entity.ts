import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InvestorType, StartupStage } from '@/common/enums/user-type.enum';
import { User } from './user.entity';

@Entity('investor_profiles')
export class InvestorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: InvestorType,
  })
  type: InvestorType;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  fundSize: number;

  @Column('decimal', { precision: 15, scale: 2 })
  checkSizeMin: number;

  @Column('decimal', { precision: 15, scale: 2 })
  checkSizeMax: number;

  @Column('enum', { enum: StartupStage, array: true, default: '{}' })
  stagePreferences: StartupStage[];

  @Column('text', { array: true, default: '{}' })
  sectorFocus: string[];

  @Column('text', { array: true, default: '{}' })
  geoFocus: string[];

  @Column('text', { nullable: true })
  description: string;

  @Column('jsonb', { nullable: true })
  notableInvestments: Record<string, any>[];

  @Column('jsonb', { nullable: true })
  portfolioMetrics: Record<string, any>;

  @Column({ nullable: true })
  reserveStrategy: string;

  @Column('integer', { nullable: true })
  avgTimeToCloseDays: number;

  @Column('vector', { nullable: true })
  investorEmbedding: number[];

  @Column('decimal', { precision: 3, scale: 2, default: 1.0 })
  availabilityScore: number;

  @Column('text', { array: true, default: '{}' })
  legalConstraints: string[];

  @Column({ default: false })
  willLead: boolean;

  @Column('text', { array: true, default: '{}' })
  valueAddOffered: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.investorProfile)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
