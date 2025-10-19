import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
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

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should create a user with minimal fields', async () => {
      const createUserDto: CreateUserDto = {
        name: 'วิชัย สุขดี',
        email: 'wichai@example.com',
      };

      const newUser = {
        ...mockUser,
        name: 'วิชัย สุขดี',
        email: 'wichai@example.com',
      };

      mockUsersService.create.mockResolvedValue(newUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(newUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should return the count of users', async () => {
      mockUsersService.count.mockResolvedValue(125);

      const result = await controller.count();

      expect(result).toBe(125);
      expect(service.count).toHaveBeenCalled();
      expect(service.count).toHaveBeenCalledTimes(1);
    });

    it('should return 0 when no users exist', async () => {
      mockUsersService.count.mockResolvedValue(0);

      const result = await controller.count();

      expect(result).toBe(0);
      expect(service.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle non-existent user id', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new Error('User with ID 507f1f77bcf86cd799439999 not found')
      );

      await expect(
        controller.findOne('507f1f77bcf86cd799439999')
      ).rejects.toThrow('User with ID 507f1f77bcf86cd799439999 not found');
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439999');
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

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateUserDto
      );

      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateUserDto
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should update only status field', async () => {
      const updateUserDto: UpdateUserDto = {
        status: 'inactive',
      };

      const updatedUser = {
        ...mockUser,
        status: 'inactive',
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateUserDto
      );

      expect(result.status).toBe('inactive');
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateUserDto
      );
    });

    it('should handle non-existent user id on update', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      mockUsersService.update.mockRejectedValue(
        new Error('User with ID 507f1f77bcf86cd799439999 not found')
      );

      await expect(
        controller.update('507f1f77bcf86cd799439999', updateUserDto)
      ).rejects.toThrow('User with ID 507f1f77bcf86cd799439999 not found');
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439999',
        updateUserDto
      );
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('507f1f77bcf86cd799439011');

      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should handle non-existent user id on delete', async () => {
      mockUsersService.remove.mockRejectedValue(
        new Error('User with ID 507f1f77bcf86cd799439999 not found')
      );

      await expect(
        controller.remove('507f1f77bcf86cd799439999')
      ).rejects.toThrow('User with ID 507f1f77bcf86cd799439999 not found');
      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439999');
    });
  });
});
