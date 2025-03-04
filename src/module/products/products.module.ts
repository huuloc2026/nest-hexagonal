import { Module } from '@nestjs/common';
import { ProductController } from './interface/controllers/product.controller';
import { ProductService } from './application/services/product.service';

import { AuthModule } from '../../auth/auth.module';
import { PRODUCT_REPOSITORY } from 'src/module/products/domain/ports/product.repository.port';
import { ProductRepositoryAdapter } from 'src/module/products/infrastructure/adapters/product.repository.adapter';
@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryAdapter,
    },
  ],
})
export class ProductsModule {}
