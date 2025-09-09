import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserType } from '@/common/enums/user-type.enum';
import { StartupProfile } from './startup-profile.entity';
import { InvestorProfile } from './investor-profile.entity';
import { Swipe } from '@/modules/matching/entities/swipe.entity';
import { Match } from '@/modules/matching/entities/match.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => StartupProfile, (startup) => startup.user)
  startupProfile: StartupProfile;

  @OneToOne(() => InvestorProfile, (investor) => investor.user)
  investorProfile: InvestorProfile;

  @OneToMany(() => Swipe, (swipe) => swipe.user)
  swipes: Swipe[];

  @OneToMany(() => Match, (match) => match.startup)
  startupMatches: Match[];

  @OneToMany(() => Match, (match) => match.investor)
  investorMatches: Match[];
}
