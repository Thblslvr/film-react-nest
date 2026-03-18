import { Injectable } from '@nestjs/common';
import { CreateOrderDto, OrderResultTicketDto } from '../order/dto/order.dto';

@Injectable()
export class OrderRepository {
  private readonly items: Array<{
    createdAt: number;
    order: CreateOrderDto;
    result: OrderResultTicketDto[];
  }> = [];

  save(order: CreateOrderDto, result: OrderResultTicketDto[]): void {
    this.items.push({ createdAt: Date.now(), order, result });
  }

  // Сейчас не используется, но оставляем как "репозиторий в памяти" для требований проекта.
  getAll() {
    return this.items;
  }
}
