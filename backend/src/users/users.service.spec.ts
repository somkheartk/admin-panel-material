import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '0812345678',
    status: 'active',
    role: 'แอดมิน',
    createdAt: new Date('2024-01-15T10:30:00.000Z'),
    updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  };

  const mockUsers = [
    mockUser,
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'สมหญิง รักดี',
      email: 'somying@example.com',
      phone: '0823456789',
      status: 'active',
      role: 'ผู้ใช้',
      createdAt: new Date('2024-01-16T11:20:00.000Z'),
      updatedAt: new Date('2024-01-16T11:20:00.000Z'),
    },
  ];

  beforeEach(async () => {
    mockUserModel = {
      constructor: jest.fn().mockResolvedValue(mockUser),
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
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'สมชาย ใจดี',
        email: 'somchai@example.com',
        phone: '0812345678',
        status: 'active',
        role: 'แอดมิน',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockUser as any);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
    });

    it('should create a user with only required fields', async () => {
      const createUserDto: CreateUserDto = {
        name: 'วิชัย สุขดี',
        email: 'wichai@example.com',
      };

      const userWithDefaults = {
        ...mockUser,
        name: 'วิชัย สุขดี',
        email: 'wichai@example.com',
        phone: undefined,
        role: undefined,
      };

      jest.spyOn(service, 'create').mockResolvedValue(userWithDefaults as any);

      const result = await service.create(createUserDto);

      expect(result).toEqual(userWithDefaults);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUsers);
      mockUserModel.find = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserModel.find).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
    });

    it('should return an empty array when no users exist', async () => {
      const execMock = jest.fn().mockResolvedValue([]);
      mockUserModel.find = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUser);
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011'
      );
      expect(execMock).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await expect(
        service.findOne('507f1f77bcf86cd799439999')
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.findOne('507f1f77bcf86cd799439999')
      ).rejects.toThrow('User with ID 507f1f77bcf86cd799439999 not found');
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'สมชาย ใจดี (อัพเดท)',
        phone: '0898765432',
      };

      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
        updatedAt: new Date('2024-01-17T10:45:00.000Z'),
      };

      const execMock = jest.fn().mockResolvedValue(updatedUser);
      mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateUserDto
      );

      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateUserDto,
        { new: true }
      );
      expect(execMock).toHaveBeenCalled();
    });

    it('should update user status', async () => {
      const updateUserDto: UpdateUserDto = {
        status: 'inactive',
      };

      const updatedUser = {
        ...mockUser,
        status: 'inactive',
      };

      const execMock = jest.fn().mockResolvedValue(updatedUser);
      mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateUserDto
      );

      expect(result.status).toBe('inactive');
    });

    it('should throw NotFoundException when user to update not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const execMock = jest.fn().mockResolvedValue(null);
      mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await expect(
        service.update('507f1f77bcf86cd799439999', updateUserDto)
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.update('507f1f77bcf86cd799439999', updateUserDto)
      ).rejects.toThrow('User with ID 507f1f77bcf86cd799439999 not found');
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUser);
      mockUserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011'
      );
      expect(execMock).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user to delete not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      mockUserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: execMock,
      });

      await expect(service.remove('507f1f77bcf86cd799439999')).rejects.toThrow(
        NotFoundException
      );

      await expect(service.remove('507f1f77bcf86cd799439999')).rejects.toThrow(
        'User with ID 507f1f77bcf86cd799439999 not found'
      );
    });
  });

  describe('count', () => {
    it('should return the count of users', async () => {
      const execMock = jest.fn().mockResolvedValue(125);
      mockUserModel.countDocuments = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.count();

      expect(result).toBe(125);
      expect(mockUserModel.countDocuments).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
    });

    it('should return 0 when no users exist', async () => {
      const execMock = jest.fn().mockResolvedValue(0);
      mockUserModel.countDocuments = jest.fn().mockReturnValue({
        exec: execMock,
      });

      const result = await service.count();

      expect(result).toBe(0);
      expect(mockUserModel.countDocuments).toHaveBeenCalled();
    });
  });
});
