import { BaseRepositoryPort } from 'src/shared/interface/BaseRepository.interface';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from '../../application/dtos/create-order.dto';
import {
  PaginatedResult,
  PaginationDto,
} from 'src/shared/interface/PaginatedResult';

export interface OrderRepositoryPort
  extends BaseRepositoryPort<Order, CreateOrderDto> {
  findByUserId(
    userId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Order>>;
  findByStatus(
    status: OrderStatus,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Order>>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  calculateTotalAmount(items: { quantity: number; price: number }[]): number;
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
