import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaticController } from './static/static.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AppConfigModule,
    DatabaseModule,
    FilmsModule,
    OrderModule,
  ],
  controllers: [AppController, StaticController],
  providers: [AppService],
})
export class AppModule {}
