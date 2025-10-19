import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    _id: '507f1f77bcf86cd799439011',
    name: 'โทรศัพท์ iPhone 15',
    description: 'โทรศัพท์มือถือรุ่นล่าสุด',
    price: 35000,
    category: 'อิเล็กทรอนิกส์',
    stock: 50,
    status: 'active',
    imageUrl: 'https://example.com/iphone.jpg',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  const mockProducts = [
    mockProduct,
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'แล็ปท็อป MacBook Pro',
      description: 'คอมพิวเตอร์โน้ตบุ๊คสำหรับมืออาชีพ',
      price: 65000,
      category: 'อิเล็กทรอนิกส์',
      stock: 25,
      status: 'active',
      imageUrl: 'https://example.com/macbook.jpg',
      createdAt: new Date('2024-01-16T11:20:00.000Z'),
      updatedAt: new Date('2024-01-16T11:20:00.000Z'),
    },
  ];

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    getTotalValue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'โทรศัพท์ iPhone 15',
        description: 'โทรศัพท์มือถือรุ่นล่าสุด',
        price: 35000,
        category: 'อิเล็กทรอนิกส์',
        stock: 50,
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should create a product with minimal fields', async () => {
      const createProductDto: CreateProductDto = {
        name: 'เมาส์ไร้สาย',
        description: 'เมาส์คุณภาพสูง',
        price: 599,
        category: 'อุปกรณ์เสริม',
      };

      const newProduct = {
        ...mockProduct,
        name: 'เมาส์ไร้สาย',
        description: 'เมาส์คุณภาพสูง',
        price: 599,
        category: 'อุปกรณ์เสริม',
        stock: 0,
      };

      mockProductsService.create.mockResolvedValue(newProduct);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(newProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(result).toEqual(mockProducts);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no products exist', async () => {
      mockProductsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'โทรศัพท์ iPhone 15 Pro',
        price: 45000,
      };

      const updatedProduct = {
        ...mockProduct,
        ...updateProductDto,
      };

      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateProductDto
      );

      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateProductDto
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should update product stock', async () => {
      const updateProductDto: UpdateProductDto = {
        stock: 30,
      };

      const updatedProduct = {
        ...mockProduct,
        stock: 30,
      };

      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateProductDto
      );

      expect(result.stock).toBe(30);
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateProductDto
      );
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove('507f1f77bcf86cd799439011');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('count', () => {
    it('should return the count of products', async () => {
      mockProductsService.count.mockResolvedValue(125);

      const result = await controller.count();

      expect(result).toBe(125);
      expect(service.count).toHaveBeenCalled();
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTotalValue', () => {
    it('should return the total value of all products', async () => {
      mockProductsService.getTotalValue.mockResolvedValue(3375000);

      const result = await controller.getTotalValue();

      expect(result).toBe(3375000);
      expect(service.getTotalValue).toHaveBeenCalled();
      expect(service.getTotalValue).toHaveBeenCalledTimes(1);
    });
  });
});
