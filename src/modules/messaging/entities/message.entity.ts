import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  senderId: string;

  @Column()
  conversationId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn()
  conversation: Conversation;
}
