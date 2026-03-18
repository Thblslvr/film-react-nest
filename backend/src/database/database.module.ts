import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const driver = (process.env.DATABASE_DRIVER ?? 'memory').toLowerCase();
    return {
      module: DatabaseModule,
      imports:
        driver === 'mongodb'
          ? [
              MongooseModule.forRoot(
                process.env.MONGODB_URI ??
                  process.env.DATABASE_URL ??
                  'mongodb://127.0.0.1:27017/afisha',
                {
                  serverSelectionTimeoutMS: 2000,
                  connectTimeoutMS: 2000,
                },
              ),
            ]
          : [],
    };
  }
}
