import { User } from '../entities/user.entity';
import { PaginatedResult } from 'src/shared/interface/PaginatedResult';

export interface UserRepositoryPort {
  findAll(
    page?: number,
    limit?: number,
    orderBy?: 'asc' | 'desc',
  ): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
