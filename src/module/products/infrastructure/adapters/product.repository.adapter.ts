import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { Product } from '../../domain/entities/product.entity';
import {
  PaginatedResult,
  PaginationDto,
} from 'src/shared/interface/PaginatedResult';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(data: any): Product {
    return new Product(
      data.id,
      data.name,
      data.description,
      new Decimal(data.price),
      data.stock,
      data.category,
      data.variants || [],
      data.reviews || [],
      data.createdAt,
      data.updatedAt,
    );
  }

  async findAll(
    PaginationDto: PaginationDto,
  ): Promise<PaginatedResult<Product>> {
    const { page, limit, orderBy } = PaginationDto;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: orderBy },
        include: { variants: true, reviews: true },
      }),
      this.prisma.product.count(),
    ]);

    return {
      data: products.map(this.mapToEntity),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, reviews: true },
    });
    return product ? this.mapToEntity(product) : null;
  }

  async create(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    const newProduct = await this.prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: new Decimal(product.price),
        stock: product.stock,
        category: product.category,
      },
      include: { variants: true, reviews: true },
    });
    return this.mapToEntity(newProduct);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
      },
      include: { variants: true, reviews: true },
    });
    return this.mapToEntity(updatedProduct);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }
}
