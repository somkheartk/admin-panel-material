import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrder = {
    _id: '507f1f77bcf86cd799439021',
    orderNumber: 'ORD-001',
    customerName: 'สมชาย ใจดี',
    product: 'โน๊ตบุ๊ค Dell XPS 15',
    amount: 45000,
    status: 'completed',
    description: 'สินค้าพร้อมส่ง',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  const mockOrders = [
    mockOrder,
    {
      _id: '507f1f77bcf86cd799439022',
      orderNumber: 'ORD-002',
      customerName: 'สมหญิง รักดี',
      product: 'iPhone 15 Pro Max',
      amount: 52900,
      status: 'pending',
      description: 'รอการจัดส่ง',
      createdAt: new Date('2024-01-16T11:20:00.000Z'),
      updatedAt: new Date('2024-01-16T11:20:00.000Z'),
    },
  ];

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    getTotalRevenue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        orderNumber: 'ORD-001',
        customerName: 'สมชาย ใจดี',
        product: 'โน๊ตบุ๊ค Dell XPS 15',
        amount: 45000,
        status: 'completed',
        description: 'สินค้าพร้อมส่ง',
      };

      mockOrdersService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(service.create).toHaveBeenCalledWith(createOrderDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should create an order with minimal fields', async () => {
      const createOrderDto: CreateOrderDto = {
        orderNumber: 'ORD-003',
        customerName: 'วิชัย สุขดี',
        product: 'MacBook Pro M3',
        amount: 89900,
      };

      const newOrder = {
        ...mockOrder,
        orderNumber: 'ORD-003',
        customerName: 'วิชัย สุขดี',
        product: 'MacBook Pro M3',
        amount: 89900,
        status: 'pending',
      };

      mockOrdersService.create.mockResolvedValue(newOrder);

      const result = await controller.create(createOrderDto);

      expect(result).toEqual(newOrder);
      expect(service.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      mockOrdersService.findAll.mockResolvedValue(mockOrders);

      const result = await controller.findAll();

      expect(result).toEqual(mockOrders);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no orders exist', async () => {
      mockOrdersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should return the count of orders', async () => {
      mockOrdersService.count.mockResolvedValue(487);

      const result = await controller.count();

      expect(result).toBe(487);
      expect(service.count).toHaveBeenCalled();
      expect(service.count).toHaveBeenCalledTimes(1);
    });

    it('should return 0 when no orders exist', async () => {
      mockOrdersService.count.mockResolvedValue(0);

      const result = await controller.count();

      expect(result).toBe(0);
      expect(service.count).toHaveBeenCalled();
    });
  });

  describe('getTotalRevenue', () => {
    it('should return the total revenue', async () => {
      mockOrdersService.getTotalRevenue.mockResolvedValue(200900);

      const result = await controller.getTotalRevenue();

      expect(result).toBe(200900);
      expect(service.getTotalRevenue).toHaveBeenCalled();
      expect(service.getTotalRevenue).toHaveBeenCalledTimes(1);
    });

    it('should return 0 when no orders exist', async () => {
      mockOrdersService.getTotalRevenue.mockResolvedValue(0);

      const result = await controller.getTotalRevenue();

      expect(result).toBe(0);
      expect(service.getTotalRevenue).toHaveBeenCalled();
    });

    it('should handle large revenue amounts', async () => {
      mockOrdersService.getTotalRevenue.mockResolvedValue(2456789.5);

      const result = await controller.getTotalRevenue();

      expect(result).toBe(2456789.5);
      expect(service.getTotalRevenue).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single order by id', async () => {
      mockOrdersService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne('507f1f77bcf86cd799439021');

      expect(result).toEqual(mockOrder);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439021');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle non-existent order id', async () => {
      mockOrdersService.findOne.mockRejectedValue(
        new Error('Order with ID 507f1f77bcf86cd799439999 not found')
      );

      await expect(
        controller.findOne('507f1f77bcf86cd799439999')
      ).rejects.toThrow('Order with ID 507f1f77bcf86cd799439999 not found');
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439999');
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'shipped',
        description: 'จัดส่งแล้ว หมายเลขพัสดุ TH123456789',
      };

      const updatedOrder = {
        ...mockOrder,
        ...updateOrderDto,
        updatedAt: new Date('2024-01-17T10:45:00.000Z'),
      };

      mockOrdersService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update(
        '507f1f77bcf86cd799439021',
        updateOrderDto
      );

      expect(result).toEqual(updatedOrder);
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439021',
        updateOrderDto
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should update only status field', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'pending',
      };

      const updatedOrder = {
        ...mockOrder,
        status: 'pending',
      };

      mockOrdersService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update(
        '507f1f77bcf86cd799439021',
        updateOrderDto
      );

      expect(result.status).toBe('pending');
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439021',
        updateOrderDto
      );
    });

    it('should update amount field', async () => {
      const updateOrderDto: UpdateOrderDto = {
        amount: 50000,
      };

      const updatedOrder = {
        ...mockOrder,
        amount: 50000,
      };

      mockOrdersService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update(
        '507f1f77bcf86cd799439021',
        updateOrderDto
      );

      expect(result.amount).toBe(50000);
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439021',
        updateOrderDto
      );
    });

    it('should handle non-existent order id on update', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'shipped',
      };

      mockOrdersService.update.mockRejectedValue(
        new Error('Order with ID 507f1f77bcf86cd799439999 not found')
      );

      await expect(
        controller.update('507f1f77bcf86cd799439999', updateOrderDto)
      ).rejects.toThrow('Order with ID 507f1f77bcf86cd799439999 not found');
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439999',
        updateOrderDto
      );
    });
  });

  describe('remove', () => {
    it('should delete an order successfully', async () => {
      mockOrdersService.remove.mockResolvedValue(undefined);

      await controller.remove('507f1f77bcf86cd799439021');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439021');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should handle non-existent order id on delete', async () => {
      mockOrdersService.remove.mockRejectedValue(
        new Error('Order with ID 507f1f77bcf86cd799439999 not found')
      );

      await expect(
        controller.remove('507f1f77bcf86cd799439999')
      ).rejects.toThrow('Order with ID 507f1f77bcf86cd799439999 not found');
      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439999');
    });
  });
});
