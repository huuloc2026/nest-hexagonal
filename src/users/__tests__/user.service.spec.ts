import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../application/services/user.service';
import { USER_REPOSITORY } from '../domain/ports/user.repository.port';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from '../domain/entities/user.entity';
import { CryptoService } from 'src/shared/services/crypto.service';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;
  let mockCryptoService: any;

  const mockUser = new User(
    '1',
    'test@example.com',
    'hashedPassword',
    'salt',
    'Test User',
    new Date(),
    new Date(),
  );

  beforeEach(async () => {
    mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCryptoService = {
      generateSalt: jest.fn().mockReturnValue('generatedSalt'),
      hashPassword: jest.fn().mockReturnValue('hashedPassword'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const paginationDto = { page: 1, limit: 10, orderBy: 'desc' as const };
      const expectedResult = {
        data: [mockUser],
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      };

      mockUserRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll(paginationDto);
      expect(result).toEqual(expectedResult);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should create a new user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockCryptoService.generateSalt).toHaveBeenCalled();
      expect(mockCryptoService.hashPassword).toHaveBeenCalledWith(
        createUserDto.password,
        'generatedSalt',
      );
    });

    it('should throw ConflictException if email exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
