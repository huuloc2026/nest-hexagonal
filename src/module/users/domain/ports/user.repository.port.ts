import { BaseRepositoryPort } from 'src/shared/interface/BaseRepository.interface';
import { User } from '../entities/user.entity';
import {
  PaginatedResult,
  PaginationDto,
} from 'src/shared/interface/PaginatedResult';

export interface UserRepositoryPort extends BaseRepositoryPort<User> {
  findAll(PaginationDto: PaginationDto): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
