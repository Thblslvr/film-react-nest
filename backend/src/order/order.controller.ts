// order.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  ListResponseDto,
  OrderResultTicketDto,
} from './dto/order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  async createOrder(
    @Body() dto: CreateOrderDto,
  ): Promise<ListResponseDto<OrderResultTicketDto>> {
    const items = await this.orderService.createOrder(dto);
    return { total: items.length, items };
  }
}
