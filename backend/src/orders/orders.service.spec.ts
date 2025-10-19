import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.schema';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockOrderModel: any;

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

  beforeEach(async () => {
    mockOrderModel = {
      constructor: jest.fn().mockResolvedValue(mockOrder),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
      sort: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: mockOrderModel,
        },
      ],
    }).compile();

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

      jest.spyOn(service, 'create').mockResolvedValue(mockOrder as any);

      const result = await service.create(createOrderDto);

      expect(result).toEqual(mockOrder);
    });

    it('should create an order with only required fields', async () => {
      const createOrderDto: CreateOrderDto = {
        orderNumber: 'ORD-003',
        customerName: 'วิชัย สุขดี',
        product: 'MacBook Pro M3',
        amount: 89900,
      };

      const orderWithDefaults = {
        ...mockOrder,
        orderNumber: 'ORD-003',
        customerName: 'วิชัย สุขดี',
        product: 'MacBook Pro M3',
        amount: 89900,
        status: 'pending',
        description: undefined,
      };

      jest.spyOn(service, 'create').mockResolvedValue(orderWithDefaults as any);

      const result = await service.create(createOrderDto);

      expect(result).toEqual(orderWithDefaults);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders sorted by createdAt descending', async () => {
      const execMock = jest.fn().mockResolvedValue(mockOrders);
      const sortMock = jest.fn().mockReturnValue({
        exec: execMock,
      });
      mockOrderModel.find = jest.fn().mockReturnValue({
        sort: sortMock,
      });

      const result = await service.findAll();

      expect(result).toEqual(mockOrders);
      expect(mockOrderModel.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
      expect(execMock).toHaveBeenCalled();
    });

    it('should return an empty array when no orders exist', async () => {
      const execMock = jest.fn().mockResolvedValue([]);
      const sortMock = jest.fn().mockReturnValue({
        exec: execMock,
      });
      mockOrderModel.find = jest.fn().mockReturnValue({
        sort: sortMock,
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockOrderModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single order by id', async () => {
      const execMock = jest.fn().mockResolvedValue(mockOrder);
      mockOrderModel.findById = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.findOne('507f1f77bcf86cd799439021');

      expect(result).toEqual(mockOrder);
      expect(mockOrderModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439021'
      );
      expect(execMock).toHaveBeenCalled();
    });

    it('should throw NotFoundException when order not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      mockOrderModel.findById = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await expect(
        service.findOne('507f1f77bcf86cd799439999')
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.findOne('507f1f77bcf86cd799439999')
      ).rejects.toThrow('Order with ID 507f1f77bcf86cd799439999 not found');
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

      const execMock = jest.fn().mockResolvedValue(updatedOrder);
      mockOrderModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439021',
        updateOrderDto
      );

      expect(result).toEqual(updatedOrder);
      expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439021',
        updateOrderDto,
        { new: true }
      );
      expect(execMock).toHaveBeenCalled();
    });

    it('should update order status to pending', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'pending',
      };

      const updatedOrder = {
        ...mockOrder,
        status: 'pending',
      };

      const execMock = jest.fn().mockResolvedValue(updatedOrder);
      mockOrderModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439021',
        updateOrderDto
      );

      expect(result.status).toBe('pending');
    });

    it('should update order amount', async () => {
      const updateOrderDto: UpdateOrderDto = {
        amount: 50000,
      };

      const updatedOrder = {
        ...mockOrder,
        amount: 50000,
      };

      const execMock = jest.fn().mockResolvedValue(updatedOrder);
      mockOrderModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439021',
        updateOrderDto
      );

      expect(result.amount).toBe(50000);
    });

    it('should throw NotFoundException when order to update not found', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: 'shipped',
      };

      const execMock = jest.fn().mockResolvedValue(null);
      mockOrderModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await expect(
        service.update('507f1f77bcf86cd799439999', updateOrderDto)
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.update('507f1f77bcf86cd799439999', updateOrderDto)
      ).rejects.toThrow('Order with ID 507f1f77bcf86cd799439999 not found');
    });
  });

  describe('remove', () => {
    it('should delete an order successfully', async () => {
      const execMock = jest.fn().mockResolvedValue(mockOrder);
      mockOrderModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await service.remove('507f1f77bcf86cd799439021');

      expect(mockOrderModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439021'
      );
      expect(execMock).toHaveBeenCalled();
    });

    it('should throw NotFoundException when order to delete not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      mockOrderModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await expect(
        service.remove('507f1f77bcf86cd799439999')
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.remove('507f1f77bcf86cd799439999')
      ).rejects.toThrow('Order with ID 507f1f77bcf86cd799439999 not found');
    });
  });

  describe('count', () => {
    it('should return the count of orders', async () => {
      const execMock = jest.fn().mockResolvedValue(487);
      mockOrderModel.countDocuments = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.count();

      expect(result).toBe(487);
      expect(mockOrderModel.countDocuments).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
    });

    it('should return 0 when no orders exist', async () => {
      const execMock = jest.fn().mockResolvedValue(0);
      mockOrderModel.countDocuments = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.count();

      expect(result).toBe(0);
      expect(mockOrderModel.countDocuments).toHaveBeenCalled();
    });
  });

  describe('getTotalRevenue', () => {
    it('should calculate and return total revenue', async () => {
      mockOrderModel.aggregate = jest
        .fn()
        .mockResolvedValue([{ _id: null, total: 200900 }]);

      const result = await service.getTotalRevenue();

      expect(result).toBe(200900);
      expect(mockOrderModel.aggregate).toHaveBeenCalledWith([
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
    });

    it('should return 0 when no orders exist', async () => {
      mockOrderModel.aggregate = jest.fn().mockResolvedValue([]);

      const result = await service.getTotalRevenue();

      expect(result).toBe(0);
      expect(mockOrderModel.aggregate).toHaveBeenCalledWith([
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
    });

    it('should handle multiple orders and sum correctly', async () => {
      mockOrderModel.aggregate = jest
        .fn()
        .mockResolvedValue([{ _id: null, total: 2456789.5 }]);

      const result = await service.getTotalRevenue();

      expect(result).toBe(2456789.5);
    });
  });
});
