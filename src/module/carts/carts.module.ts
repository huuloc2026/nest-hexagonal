import { Module } from '@nestjs/common';
import { CartService } from './application/services/cart.service';
import { CART_REPOSITORY } from './domain/ports/cart.repository.port';
import { CartRepositoryAdapter } from './infrastructure/adapters/cart.repository.adapter';
import { CartController } from './interface/carts.controller';
@Module({
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CART_REPOSITORY,
      useClass: CartRepositoryAdapter,
    },
  ],
  exports: [CartService],
})
export class CartsModule {}
