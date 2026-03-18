import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaticController } from './static/static.controller';
import { StaticSeedService } from './static/static.seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AppConfigModule,
    DatabaseModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public'),
      serveRoot: '/content/afisha',
    }),
    FilmsModule.forRoot(),
    OrderModule,
  ],
  controllers: [AppController, StaticController],
  providers: [AppService, StaticSeedService],
})
export class AppModule {}
