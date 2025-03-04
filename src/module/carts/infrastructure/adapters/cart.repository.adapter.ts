import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { CartRepositoryPort } from '../../domain/ports/cart.repository.port';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { AddCartItemDto } from '../../application/dtos/add-cart-item.dto';

@Injectable()
export class CartRepositoryAdapter implements CartRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapToCartEntity(data: any): Cart {
    return new Cart(
      data.id,
      data.userId,
      data.items?.map(this.mapToCartItemEntity) || [],
      data.createdAt,
      data.updatedAt,
    );
  }

  private mapToCartItemEntity(data: any): CartItem {
    return new CartItem(
      data.id,
      data.cartId,
      data.productId,
      data.quantity,
      data.product,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return cart ? this.mapToCartEntity(cart) : null;
  }

  async createCart(userId: string): Promise<Cart> {
    const cart = await this.prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
    return this.mapToCartEntity(cart);
  }

  async findCartItemByProductId(
    cartId: string,
    productId: string,
  ): Promise<CartItem | null> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
      include: {
        product: true,
      },
    });
    return cartItem ? this.mapToCartItemEntity(cartItem) : null;
  }

  async addItem(cartId: string, item: AddCartItemDto): Promise<CartItem> {
    const existingItem = await this.findCartItemByProductId(
      cartId,
      item.productId,
    );

    if (existingItem) {
      // Update existing item quantity
      return this.updateItemQuantity(
        cartId,
        existingItem.id,
        existingItem.quantity + item.quantity,
      );
    }

    // Create new item if it doesn't exist
    const cartItem = await this.prisma.cartItem.create({
      data: {
        cartId,
        productId: item.productId,
        quantity: item.quantity,
      },
      include: {
        product: true,
      },
    });

    return this.mapToCartItemEntity(cartItem);
  }

  async updateItemQuantity(
    cartId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartItem> {
    const cartItem = await this.prisma.cartItem.update({
      where: {
        id: itemId,
        cartId,
      },
      data: { quantity },
      include: {
        product: true,
      },
    });
    return this.mapToCartItemEntity(cartItem);
  }

  async removeItem(cartId: string, itemId: string): Promise<void> {
    await this.prisma.cartItem.delete({
      where: {
        id: itemId,
        cartId,
      },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async getCartItem(cartId: string, itemId: string): Promise<CartItem | null> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        id: itemId,
        cartId,
      },
      include: {
        product: true,
      },
    });
    return cartItem ? this.mapToCartItemEntity(cartItem) : null;
  }
}
