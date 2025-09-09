import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'postgres'),
  password: configService.get('DATABASE_PASSWORD', 'password'),
  database: configService.get('DATABASE_NAME', 'matchmaking_db'),
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  subscribers: ['src/**/*.subscriber{.ts,.js}'],
});
