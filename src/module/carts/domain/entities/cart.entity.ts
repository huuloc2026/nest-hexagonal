import { CartItem } from './cart-item.entity';

export class Cart {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: CartItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  calculateTotal(): number {
    return this.items.reduce((total, item) => total + item.subtotal(), 0);
  }
}
