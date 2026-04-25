import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TicketDto, OrderResultTicketDto } from './dto/order.dto';
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

  async createOrder(tickets: TicketDto[]): Promise<OrderResultTicketDto[]> {
    if (!tickets?.length) {
      throw new BadRequestException({ error: 'Tickets are required' });
    }

    const results: OrderResultTicketDto[] = [];

    for (const ticket of tickets) {
      if (
        !ticket.film ||
        !ticket.session ||
        ticket.row === undefined ||
        ticket.seat === undefined
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

    this.orderRepo.save(tickets, results);
    return results;
  }
}