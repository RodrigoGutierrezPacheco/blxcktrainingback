import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserBase } from './entities/user-base.entity';
import { NormalUser } from './entities/normal-user.entity';
import { User } from './entities/user.entity';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserBaseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockNormalUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserBase),
          useValue: mockUserBaseRepository,
        },
        {
          provide: getRepositoryToken(NormalUser),
          useValue: mockNormalUserRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNormalUser', () => {
    it('should create a normal user successfully', async () => {
      const createDto: CreateNormalUserDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        routine: 'Basic routine',
        basicInfo: {},
      };

      const mockBaseUser = { id: 1, ...createDto, userType: 'user' };
      const mockNormalUser = { id: 1, baseUser: mockBaseUser, routine: 'Basic routine', basicInfo: {} };

      mockUserBaseRepository.findOne.mockResolvedValue(null);
      mockUserBaseRepository.create.mockReturnValue(mockBaseUser);
      mockUserBaseRepository.save.mockResolvedValue(mockBaseUser);
      mockNormalUserRepository.create.mockReturnValue(mockNormalUser);
      mockNormalUserRepository.save.mockResolvedValue(mockNormalUser);

      const result = await service.createNormalUser(createDto);
      expect(result).toEqual(mockNormalUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto: CreateNormalUserDto = {
        fullName: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
        routine: 'Basic routine',
        basicInfo: {},
      };

      mockUserBaseRepository.findOne.mockResolvedValue({ id: 1, email: 'existing@example.com' });

      await expect(service.createNormalUser(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateUser', () => {
    it('should update user information successfully', async () => {
      const userId = 'user-123';
      const updateDto: UpdateUserDto = {
        fullName: 'Updated Name',
        dateOfBirth: '1990-01-01',
        healthIssues: 'No issues',
        age: 30,
        weight: 70.5,
        height: 175,
      };

      const existingUser = {
        id: userId,
        fullName: 'Old Name',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      const updatedUser = {
        ...existingUser,
        fullName: 'Updated Name',
        dateOfBirth: new Date('1990-01-01'),
        healthIssues: 'No issues',
        age: 30,
        weight: 70.5,
        height: 175,
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateDto);
      
      // Verificar que la contraseña no se incluya en el resultado
      expect(result.password).toBeUndefined();
      expect(result.fullName).toBe('Updated Name');
      expect(result.dateOfBirth).toEqual(new Date('1990-01-01'));
      expect(result.healthIssues).toBe('No issues');
      expect(result.age).toBe(30);
      expect(result.weight).toBe(70.5);
      expect(result.height).toBe(175);
    });

    it('should update password with hash when provided', async () => {
      const userId = 'user-123';
      const updateDto: UpdateUserDto = {
        password: 'newPassword123',
      };

      const existingUser = {
        id: userId,
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'oldHashedPassword',
        role: 'user',
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue({
        ...existingUser,
        password: 'newHashedPassword',
      });

      const result = await service.updateUser(userId, updateDto);
      expect(result.password).toBeUndefined();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 'non-existent';
      const updateDto: UpdateUserDto = {
        fullName: 'Updated Name',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUser(userId, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should handle partial updates correctly', async () => {
      const userId = 'user-123';
      const updateDto: UpdateUserDto = {
        fullName: 'Only Name Update',
      };

      const existingUser = {
        id: userId,
        fullName: 'Old Name',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      const updatedUser = {
        ...existingUser,
        fullName: 'Only Name Update',
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateDto);
      expect(result.fullName).toBe('Only Name Update');
      expect(result.dateOfBirth).toBeUndefined();
      expect(result.healthIssues).toBeUndefined();
    });

    it('should update physical measurements correctly', async () => {
      const userId = 'user-123';
      const updateDto: UpdateUserDto = {
        age: 25,
        weight: 68.0,
        height: 170,
      };

      const existingUser = {
        id: userId,
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      const updatedUser = {
        ...existingUser,
        age: 25,
        weight: 68.0,
        height: 170,
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateDto);
      expect(result.age).toBe(25);
      expect(result.weight).toBe(68.0);
      expect(result.height).toBe(170);
      expect(result.fullName).toBe('Test User'); // Campo no modificado
    });
  });
});
