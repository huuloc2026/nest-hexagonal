import { Module } from '@nestjs/common';

import { OrderService } from './application/services/order.service';
import { ORDER_REPOSITORY } from './domain/ports/order.repository.port';
import { OrderRepositoryAdapter } from './infrastructure/adapters/order.repository.adapter';

@Module({
  controllers: [],
  providers: [
    OrderService,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepositoryAdapter,
    },
  ],
  exports: [OrderService],
})
export class OrdersModule {}
