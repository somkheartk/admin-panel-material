import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.schema';
import { CreateProductDto, UpdateProductDto } from './product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel: any;

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

  beforeEach(async () => {
    mockProductModel = {
      constructor: jest.fn().mockResolvedValue(mockProduct),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

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

      jest.spyOn(service, 'create').mockResolvedValue(mockProduct as any);

      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
    });

    it('should create a product with default stock value', async () => {
      const createProductDto: CreateProductDto = {
        name: 'เมาส์ไร้สาย',
        description: 'เมาส์คุณภาพสูง',
        price: 599,
        category: 'อุปกรณ์เสริม',
      };

      const productWithDefaults = {
        ...mockProduct,
        name: 'เมาส์ไร้สาย',
        description: 'เมาส์คุณภาพสูง',
        price: 599,
        category: 'อุปกรณ์เสริม',
        stock: 0,
      };

      jest.spyOn(service, 'create').mockResolvedValue(productWithDefaults as any);

      const result = await service.create(createProductDto);

      expect(result).toEqual(productWithDefaults);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const execMock = jest.fn().mockResolvedValue(mockProducts);
      mockProductModel.find = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
    });

    it('should return an empty array when no products exist', async () => {
      const execMock = jest.fn().mockResolvedValue([]);
      mockProductModel.find = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockProductModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const execMock = jest.fn().mockResolvedValue(mockProduct);
      mockProductModel.findById = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockProduct);
      expect(mockProductModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011'
      );
      expect(execMock).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      mockProductModel.findById = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await expect(
        service.findOne('507f1f77bcf86cd799439999')
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.findOne('507f1f77bcf86cd799439999')
      ).rejects.toThrow('Product with ID 507f1f77bcf86cd799439999 not found');
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'โทรศัพท์ iPhone 15 Pro',
        price: 45000,
      };

      const updatedProduct = {
        ...mockProduct,
        ...updateProductDto,
        updatedAt: new Date('2024-01-17T10:45:00.000Z'),
      };

      const execMock = jest.fn().mockResolvedValue(updatedProduct);
      mockProductModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateProductDto
      );

      expect(result).toEqual(updatedProduct);
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateProductDto,
        { new: true }
      );
      expect(execMock).toHaveBeenCalled();
    });

    it('should update product stock', async () => {
      const updateProductDto: UpdateProductDto = {
        stock: 30,
      };

      const updatedProduct = {
        ...mockProduct,
        stock: 30,
      };

      const execMock = jest.fn().mockResolvedValue(updatedProduct);
      mockProductModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateProductDto
      );

      expect(result.stock).toBe(30);
    });

    it('should throw NotFoundException when product to update not found', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };

      const execMock = jest.fn().mockResolvedValue(null);
      mockProductModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await expect(
        service.update('507f1f77bcf86cd799439999', updateProductDto)
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.update('507f1f77bcf86cd799439999', updateProductDto)
      ).rejects.toThrow('Product with ID 507f1f77bcf86cd799439999 not found');
    });
  });

  describe('remove', () => {
    it('should delete a product successfully', async () => {
      const execMock = jest.fn().mockResolvedValue(mockProduct);
      mockProductModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011'
      );
      expect(execMock).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product to delete not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      mockProductModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await expect(service.remove('507f1f77bcf86cd799439999')).rejects.toThrow(
        NotFoundException
      );

      await expect(service.remove('507f1f77bcf86cd799439999')).rejects.toThrow(
        'Product with ID 507f1f77bcf86cd799439999 not found'
      );
    });
  });

  describe('count', () => {
    it('should return the count of products', async () => {
      const execMock = jest.fn().mockResolvedValue(125);
      mockProductModel.countDocuments = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.count();

      expect(result).toBe(125);
      expect(mockProductModel.countDocuments).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
    });

    it('should return 0 when no products exist', async () => {
      const execMock = jest.fn().mockResolvedValue(0);
      mockProductModel.countDocuments = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.count();

      expect(result).toBe(0);
      expect(mockProductModel.countDocuments).toHaveBeenCalled();
    });
  });

  describe('getTotalValue', () => {
    it('should calculate total value of all products', async () => {
      const execMock = jest.fn().mockResolvedValue(mockProducts);
      mockProductModel.find = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.getTotalValue();

      // mockProducts[0]: 35000 * 50 = 1,750,000
      // mockProducts[1]: 65000 * 25 = 1,625,000
      // Total: 3,375,000
      expect(result).toBe(3375000);
      expect(mockProductModel.find).toHaveBeenCalled();
    });

    it('should return 0 when no products exist', async () => {
      const execMock = jest.fn().mockResolvedValue([]);
      mockProductModel.find = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.getTotalValue();

      expect(result).toBe(0);
    });
  });
});
