import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    createNormalUser: jest.fn(),
    updateUser: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerNormalUser', () => {
    it('should create a normal user', async () => {
      const createDto: CreateNormalUserDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        routine: 'Basic routine',
        basicInfo: {},
      };

      const expectedResult = { id: 1, fullName: 'Test User' };
      mockUsersService.createNormalUser.mockResolvedValue(expectedResult);

      const result = await controller.registerNormalUser(createDto);
      expect(result).toEqual(expectedResult);
      expect(service.createNormalUser).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateUser', () => {
    it('should allow user to update their own information', async () => {
      const userId = 'user-123';
      const updateDto: UpdateUserDto = {
        fullName: 'Updated Name',
        dateOfBirth: '1990-01-01',
        healthIssues: 'No issues',
      };

      const mockRequest = {
        user: {
          sub: 'user-123',
          role: 'user',
        },
      };

      const expectedResult = { id: userId, fullName: 'Updated Name' };
      mockUsersService.updateUser.mockResolvedValue(expectedResult);

      const result = await controller.updateUser(userId, updateDto, mockRequest);
      expect(result).toEqual(expectedResult);
      expect(service.updateUser).toHaveBeenCalledWith(userId, updateDto);
    });

    it('should allow admin to update any user information', async () => {
      const userId = 'user-123';
      const updateDto: UpdateUserDto = {
        fullName: 'Updated Name',
      };

      const mockRequest = {
        user: {
          sub: 'admin-456',
          role: 'admin',
        },
      };

      const expectedResult = { id: userId, fullName: 'Updated Name' };
      mockUsersService.updateUser.mockResolvedValue(expectedResult);

      const result = await controller.updateUser(userId, updateDto, mockRequest);
      expect(result).toEqual(expectedResult);
      expect(service.updateUser).toHaveBeenCalledWith(userId, updateDto);
    });

    it('should throw ForbiddenException when user tries to update another user', async () => {
      const userId = 'user-123';
      const updateDto: UpdateUserDto = {
        fullName: 'Updated Name',
      };

      const mockRequest = {
        user: {
          sub: 'user-456',
          role: 'user',
        },
      };

      await expect(
        controller.updateUser(userId, updateDto, mockRequest),
      ).rejects.toThrow(ForbiddenException);
      expect(service.updateUser).not.toHaveBeenCalled();
    });
  });
});
