import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { StartupProfile } from './entities/startup-profile.entity';
import { InvestorProfile } from './entities/investor-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StartupProfile, InvestorProfile]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
