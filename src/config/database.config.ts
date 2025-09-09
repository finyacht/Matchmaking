import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Use SQLite for quick deployment, PostgreSQL for production
  const usePostgres = configService.get('USE_POSTGRES', 'false') === 'true';
  
  if (usePostgres) {
    return {
      type: 'postgres',
      host: configService.get('DATABASE_HOST', 'localhost'),
      port: configService.get('DATABASE_PORT', 5432),
      username: configService.get('DATABASE_USERNAME', 'postgres'),
      password: configService.get('DATABASE_PASSWORD', 'password'),
      database: configService.get('DATABASE_NAME', 'matchmaking_db'),
      synchronize: configService.get('NODE_ENV') === 'development',
      logging: configService.get('NODE_ENV') === 'development',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
    };
  }
  
  // SQLite configuration for immediate deployment
  return {
    type: 'sqlite',
    database: 'matchmaking.db',
    synchronize: true,
    logging: configService.get('NODE_ENV') === 'development',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
  };
};
