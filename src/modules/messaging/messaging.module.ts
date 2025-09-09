import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { MessagingGateway } from './messaging.gateway';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { MatchingModule } from '@/modules/matching/matching.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    MatchingModule,
  ],
  providers: [MessagingService, MessagingGateway],
  controllers: [MessagingController],
  exports: [MessagingService],
})
export class MessagingModule {}
