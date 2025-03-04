import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CART_REPOSITORY,
  CartRepositoryPort,
} from '../../domain/ports/cart.repository.port';
import { AddCartItemDto } from '../dtos/add-cart-item.dto';
import { UpdateCartItemDto } from '../dtos/update-cart-item.dto';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepositoryPort,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }
    return cart;
  }

  async addItem(userId: string, itemDto: AddCartItemDto): Promise<CartItem> {
    const cart = await this.getOrCreateCart(userId);

    // Check if product exists in cart
    const existingItem = await this.cartRepository.findCartItemByProductId(
      cart.id,
      itemDto.productId,
    );

    if (existingItem) {
      // If item exists, update quantity
      return this.cartRepository.updateItemQuantity(
        cart.id,
        existingItem.id,
        existingItem.quantity + itemDto.quantity,
      );
    }

    // If item doesn't exist, add new item
    return this.cartRepository.addItem(cart.id, itemDto);
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    updateDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartRepository.getCartItem(cart.id, itemId);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return this.cartRepository.updateItemQuantity(
      cart.id,
      itemId,
      updateDto.quantity,
    );
  }

  async removeItem(userId: string, itemId: string): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartRepository.removeItem(cart.id, itemId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartRepository.clearCart(cart.id);
  }

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }
}
