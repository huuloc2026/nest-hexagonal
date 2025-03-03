import { Category, ProductVariant, Review } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: Decimal,
    public readonly stock: number,
    public readonly category: Category,
    public readonly variants: ProductVariant[],
    public readonly reviews: Review[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
