import { OrderStatus } from '@prisma/client';
import { OrderItem } from './order-item.entity';

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public readonly totalAmount: number,
    public readonly status: OrderStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
