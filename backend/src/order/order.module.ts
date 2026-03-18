import { Module } from '@nestjs/common';
import { FilmsModule } from '../films/films.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from '../repository/order.repository';

@Module({
  imports: [FilmsModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
