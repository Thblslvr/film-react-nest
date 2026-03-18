import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/afisha', {
    exclude: [
      { path: 'content/afisha', method: RequestMethod.ALL },
      { path: 'content/afisha/(.*)', method: RequestMethod.ALL },
    ],
  });
  app.enableCors();
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
