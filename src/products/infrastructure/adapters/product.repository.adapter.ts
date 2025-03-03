import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { Product } from '../../domain/entities/product.entity';
import {
  PaginatedResult,
  PaginationDto,
} from 'src/shared/interface/PaginatedResult';
@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    PaginationDto: PaginationDto,
  ): Promise<PaginatedResult<Product>> {
    const { page, limit, orderBy } = PaginationDto;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: orderBy,
        },
      }),
      this.prisma.product.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map(
        (p) =>
          new Product(
            p.id,
            p.name,
            p.description,
            Number(p.price),
            p.stock,
            p.createdAt,
            p.updatedAt,
          ),
      ),
      page,
      limit,
      totalPages,
      total,
    };
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) return null;
    return new Product(
      product.id,
      product.name,
      product.description,
      Number(product.price),
      product.stock,
      product.createdAt,
      product.updatedAt,
    );
  }

  async create(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    const newProduct = await this.prisma.product.create({
      data: {
        ...product,
        price: product.price.toString(),
      },
    });
    return new Product(
      newProduct.id,
      newProduct.name,
      newProduct.description,
      Number(newProduct.price),
      newProduct.stock,
      newProduct.createdAt,
      newProduct.updatedAt,
    );
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...product,
        price: product.price?.toString(),
      },
    });
    return new Product(
      updatedProduct.id,
      updatedProduct.name,
      updatedProduct.description,
      Number(updatedProduct.price),
      updatedProduct.stock,
      updatedProduct.createdAt,
      updatedProduct.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }
}
