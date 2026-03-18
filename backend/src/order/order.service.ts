import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto, OrderResultTicketDto } from './dto/order.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';
import { OrderRepository } from '../repository/order.repository';
import { randomUUID } from 'node:crypto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly filmsRepo: FilmsRepository,
    private readonly orderRepo: OrderRepository,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResultTicketDto[]> {
    if (!dto?.tickets?.length) {
      throw new BadRequestException({ error: 'Tickets are required' });
    }

    // Сначала валидируем/бронируем места последовательно, чтобы не получить частично выполненный заказ.
    const results: OrderResultTicketDto[] = [];

    for (const ticket of dto.tickets) {
      if (
        !ticket?.film ||
        !ticket?.session ||
        ticket?.row === undefined ||
        ticket?.row === null ||
        ticket?.seat === undefined ||
        ticket?.seat === null
      ) {
        throw new BadRequestException({ error: 'Invalid ticket' });
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      await this.filmsRepo.takeSeat({
        filmId: ticket.film,
        sessionId: ticket.session,
        seatKey,
      });

      results.push({
        ...ticket,
        id: randomUUID(),
      });
    }

    this.orderRepo.save(dto, results);
    return results;
  }
}
