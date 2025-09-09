import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SwipeDirection } from '@/common/enums/user-type.enum';
import { User } from '@/modules/users/entities/user.entity';

@Entity('swipes')
export class Swipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SwipeDirection,
  })
  direction: SwipeDirection;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  scoreAtSwipe: number;

  @Column('text', { nullable: true })
  metadata: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.swipes)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column()
  targetId: string;
}
