import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { PaginatedResult } from 'src/shared/interface/PaginatedResult';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    orderBy: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedResult<User>> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: orderBy,
        },
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map(
        (u) =>
          new User(u.id, u.email, u.password, u.name, u.createdAt, u.updatedAt),
      ),
      page,
      limit,
      totalPages,
      total,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return new User(
      user.id,
      user.email,
      user.password,
      user.name,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return new User(
      user.id,
      user.email,
      user.password,
      user.name,
      user.createdAt,
      user.updatedAt,
    );
  }

  async create(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: user,
    });
    return new User(
      newUser.id,
      newUser.email,
      newUser.password,
      newUser.name,
      newUser.createdAt,
      newUser.updatedAt,
    );
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: user,
    });
    return new User(
      updatedUser.id,
      updatedUser.email,
      updatedUser.password,
      updatedUser.name,
      updatedUser.createdAt,
      updatedUser.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
