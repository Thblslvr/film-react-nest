// order.dto.ts
export class TicketDto {
  film!: string;
  session!: string;
  daytime!: string;
  row!: number;
  seat!: number;
  price!: number;
}

// Тело запроса — массив билетов
export type CreateOrderDto = TicketDto[];

export class OrderResultTicketDto extends TicketDto {
  id!: string;
}

export class ListResponseDto<TItem> {
  total!: number;
  items!: TItem[];
}
