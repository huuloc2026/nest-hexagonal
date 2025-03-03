import { Module } from '@nestjs/common';
import { ProductController } from './interface/controllers/product.controller';
import { ProductService } from './application/services/product.service';
import { ProductRepositoryAdapter } from './infrastructure/adapters/product.repository.adapter';
import { PRODUCT_REPOSITORY } from './domain/ports/product.repository.port';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
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
