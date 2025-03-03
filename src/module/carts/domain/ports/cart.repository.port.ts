import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { AddCartItemDto } from '../../application/dtos/add-cart-item.dto';

export interface CartRepositoryPort {
  findByUserId(userId: string): Promise<Cart | null>;
  createCart(userId: string): Promise<Cart>;
  addItem(cartId: string, item: AddCartItemDto): Promise<CartItem>;
  updateItemQuantity(
    cartId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartItem>;
  removeItem(cartId: string, itemId: string): Promise<void>;
  clearCart(cartId: string): Promise<void>;
  getCartItem(cartId: string, itemId: string): Promise<CartItem | null>;
}

export const CART_REPOSITORY = 'CART_REPOSITORY';
