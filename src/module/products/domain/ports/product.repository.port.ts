import { BaseRepositoryPort } from 'src/shared/interface/BaseRepository.interface';
import { Product } from '../entities/product.entity';
import {
  PaginatedResult,
  PaginationDto,
} from 'src/shared/interface/PaginatedResult';

export interface ProductRepositoryPort extends BaseRepositoryPort<Product> {
  findAll(PaginationDto: PaginationDto): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  create(product: Partial<Product>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
