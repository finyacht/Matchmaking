import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MatchStatus } from '@/common/enums/user-type.enum';
import { User } from '@/modules/users/entities/user.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 5, scale: 2 })
  startupScore: number;

  @Column('decimal', { precision: 5, scale: 2 })
  investorScore: number;

  @Column('decimal', { precision: 5, scale: 2 })
  mutualScore: number;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.PENDING,
  })
  status: MatchStatus;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.startupMatches)
  @JoinColumn()
  startup: User;

  @Column()
  startupId: string;

  @ManyToOne(() => User, (user) => user.investorMatches)
  @JoinColumn()
  investor: User;

  @Column()
  investorId: string;
}
