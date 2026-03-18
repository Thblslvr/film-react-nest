import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type DatabaseDriver = 'mongodb' | 'memory';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return this.config.get<number>('PORT') ?? 3000;
  }

  get databaseDriver(): DatabaseDriver {
    return (this.config.get<string>('DATABASE_DRIVER') ??
      'memory') as DatabaseDriver;
  }

  get mongoUri(): string {
    return (
      this.config.get<string>('MONGODB_URI') ??
      this.config.get<string>('DATABASE_URL') ??
      'mongodb://127.0.0.1:27017/afisha'
    );
  }
}
