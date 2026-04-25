import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const driver = configService.get<string>('DATABASE_DRIVER');
            if (driver !== 'postgres') {
              // Если не postgres, не подключаем TypeORM (например, для тестов)
              return {};
            }
            return {
              type: 'postgres',
              url: configService.get<string>('DATABASE_URL'),
              username: configService.get<string>('DATABASE_USERNAME'),
              password: configService.get<string>('DATABASE_PASSWORD'),
              entities: [__dirname + '/../**/*.entity{.ts,.js}'],
              synchronize: process.env.NODE_ENV !== 'production',
              logging: false,
            };
          },
        }),
      ],
    };
  }
}
