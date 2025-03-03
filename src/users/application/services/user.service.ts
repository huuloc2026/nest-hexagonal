import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import {
  UserRepositoryPort,
  USER_REPOSITORY,
} from '../../domain/ports/user.repository.port';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../../domain/entities/user.entity';
import { PaginatedResult } from 'src/shared/interface/PaginatedResult';
import { CryptoService } from 'src/shared/services/crypto.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly cryptoService: CryptoService,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  async findAll(): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = this.cryptoService.generateSalt();
    const hashedPassword = this.cryptoService.hashPassword(
      createUserDto.password,
      salt,
    );

    return this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      salt,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findById(id);
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }
    return this.userRepository.update(id, updateUserDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
