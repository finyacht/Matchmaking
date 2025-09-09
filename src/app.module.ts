import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from '@/config/database.config';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { MatchingModule } from '@/modules/matching/matching.module';
import { MessagingModule } from '@/modules/messaging/messaging.module';
import { AiModule } from '@/modules/ai/ai.module';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    CommonModule,
    UsersModule,
    AuthModule,
    MatchingModule,
    MessagingModule,
    AiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
