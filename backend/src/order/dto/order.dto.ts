export class TicketDto {
  film!: string;
  session!: string;
  daytime!: string;
  row!: number;
  seat!: number;
  price!: number;
}

export class CreateOrderDto {
  email!: string;
  phone!: string;
  tickets!: TicketDto[];
}

export class OrderResultTicketDto extends TicketDto {
  id!: string;
}

export class ListResponseDto<TItem> {
  total!: number;
  items!: TItem[];
}

//TODO реализовать DTO для /orders
