import { Product } from '../../../products/domain/entities/product.entity';

export class CartItem {
  constructor(
    public readonly id: string,
    public readonly cartId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly product: Product,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  subtotal(): number {
    return this.product.price.toNumber() * this.quantity;
  }
}
