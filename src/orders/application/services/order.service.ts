import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  OrderRepositoryPort,
  ORDER_REPOSITORY,
} from '../../domain/ports/order.repository.port';

import { Order } from '../../domain/entities/order.entity';
import { OrderStatus } from '@prisma/client';
import {
  PaginatedResult,
  PaginationDto,
} from '../../../shared/interface/PaginatedResult';
import { CreateOrderDto } from 'src/orders/application/dtos/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    if (!createOrderDto.items.length) {
      throw new BadRequestException('Order must contain at least one item');
    }
    return this.orderRepository.create(createOrderDto);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Order>> {
    return this.orderRepository.findAll(pagination);
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByUserId(
    userId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Order>> {
    return this.orderRepository.findByUserId(userId, pagination);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await this.findById(id);
    return this.orderRepository.updateStatus(id, status);
  }
}
