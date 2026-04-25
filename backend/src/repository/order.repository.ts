import { Injectable } from '@nestjs/common';
import { TicketDto, OrderResultTicketDto } from '../order/dto/order.dto';

@Injectable()
export class OrderRepository {
  private readonly items: Array<{
    createdAt: number;
    tickets: TicketDto[];
    result: OrderResultTicketDto[];
  }> = [];

  save(tickets: TicketDto[], result: OrderResultTicketDto[]): void {
    this.items.push({ createdAt: Date.now(), tickets, result });
  }

  getAll() {
    return this.items;
  }
}
