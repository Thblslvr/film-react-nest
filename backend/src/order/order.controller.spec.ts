import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  OrderResultTicketDto,
  ListResponseDto,
} from './dto/order.dto';
import { BadRequestException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  const mockTicket: CreateOrderDto[0] = {
    film: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    session: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
    daytime: '2023-05-29T10:30:00.001Z',
    row: 2,
    seat: 5,
    price: 350,
  };

  const mockResultTicket: OrderResultTicketDto = {
    ...mockTicket,
    id: 'c2260f3b-6ca0-453f-f379-96ffa676089d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should successfully create order and return tickets with IDs', async () => {
      const tickets: CreateOrderDto = [mockTicket];
      const expectedResult: OrderResultTicketDto[] = [mockResultTicket];
      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.createOrder(tickets);
      const expectedResponse: ListResponseDto<OrderResultTicketDto> = {
        total: expectedResult.length,
        items: expectedResult,
      };
      expect(result).toEqual(expectedResponse);
      expect(orderService.createOrder).toHaveBeenCalledWith(tickets);
    });

    it('should handle multiple tickets', async () => {
      const tickets: CreateOrderDto = [mockTicket, { ...mockTicket, seat: 6 }];
      const results: OrderResultTicketDto[] = [
        { ...mockTicket, id: 'uuid-1' },
        { ...mockTicket, seat: 6, id: 'uuid-2' },
      ];
      mockOrderService.createOrder.mockResolvedValue(results);

      const response = await controller.createOrder(tickets);
      expect(response.total).toBe(2);
      expect(response.items).toHaveLength(2);
      expect(response.items[0].id).toBeDefined();
      expect(orderService.createOrder).toHaveBeenCalledWith(tickets);
    });

    it('should propagate BadRequestException from service', async () => {
      const error = new BadRequestException({ error: 'Seat already taken' });
      mockOrderService.createOrder.mockRejectedValue(error);

      await expect(controller.createOrder([mockTicket])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should propagate errors when no tickets provided (service validation)', async () => {
      const error = new BadRequestException({ error: 'Tickets are required' });
      mockOrderService.createOrder.mockRejectedValue(error);

      await expect(controller.createOrder([])).rejects.toThrow(
        BadRequestException,
      );
      expect(orderService.createOrder).toHaveBeenCalledWith([]);
    });

    it('should return correct ListResponseDto structure', async () => {
      const tickets: CreateOrderDto = [mockTicket];
      const results = [mockResultTicket];
      mockOrderService.createOrder.mockResolvedValue(results);

      const response = await controller.createOrder(tickets);
      expect(response).toHaveProperty('total');
      expect(response).toHaveProperty('items');
      expect(Array.isArray(response.items)).toBe(true);
    });
  });
});