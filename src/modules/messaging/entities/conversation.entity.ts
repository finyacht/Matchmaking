import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Match } from '@/modules/matching/entities/match.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  participant1Id: string;

  @Column()
  participant2Id: string;

  @Column({ nullable: true })
  lastMessageText: string;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Match)
  @JoinColumn()
  match: Match;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'participant1Id' })
  participant1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'participant2Id' })
  participant2: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
