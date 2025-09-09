import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { Match } from './entities/match.entity';
import { Swipe } from './entities/swipe.entity';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Swipe]),
    UsersModule,
  ],
  providers: [MatchingService],
  controllers: [MatchingController],
  exports: [MatchingService],
})
export class MatchingModule {}
