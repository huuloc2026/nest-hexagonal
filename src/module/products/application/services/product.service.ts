import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../../domain/entities/product.entity';
import { PRODUCT_REPOSITORY } from '../../domain/ports/product.repository.port';
import {
  PaginatedResult,
  PaginationDto,
} from 'src/shared/interface/PaginatedResult';
@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async findAll(
    PaginationDto: PaginationDto,
  ): Promise<PaginatedResult<Product>> {
    return this.productRepository.findAll(PaginationDto);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findById(id);
    return this.productRepository.update(id, updateProductDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.productRepository.delete(id);
  }
}
