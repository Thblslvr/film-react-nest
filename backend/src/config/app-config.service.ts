import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type DatabaseDriver = 'postgres' | 'memory';

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
}
