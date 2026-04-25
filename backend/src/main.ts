import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, LoggerService } from '@nestjs/common'; // ← импортируем LoggerService
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha', {
    exclude: [
      { path: 'content/afisha', method: RequestMethod.ALL },
      { path: 'content/afisha/(.*)', method: RequestMethod.ALL },
    ],
  });
  app.enableCors();

  const configService = app.get(ConfigService);
  const logFormat = configService.get<string>('LOG_FORMAT') ?? 'dev';

  let logger: LoggerService;
  switch (logFormat) {
    case 'json':
      logger = new JsonLogger();
      break;
    case 'tskv':
      logger = new TskvLogger();
      break;
    default:
      logger = new DevLogger();
  }
  app.useLogger(logger);

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
