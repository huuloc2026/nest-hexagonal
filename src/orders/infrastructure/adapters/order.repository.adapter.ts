import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { OrderRepositoryPort } from '../../domain/ports/order.repository.port';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { CreateOrderDto } from '../../application/dtos/create-order.dto';
import { OrderStatus } from '@prisma/client';
import {
  PaginatedResult,
  PaginationDto,
} from '../../../shared/interface/PaginatedResult';

@Injectable()
export class OrderRepositoryAdapter implements OrderRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Order>> {
    const { page, limit, orderBy } = pagination;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: orderBy },
        include: { items: true },
      }),
      this.prisma.order.count(),
    ]);

    return {
      data: orders.map(this.mapToEntity),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByStatus(
    status: OrderStatus,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Order>> {
    const { page, limit, orderBy } = pagination;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { status },
        skip,
        take: limit,
        orderBy: { createdAt: orderBy },
        include: { items: true },
      }),
      this.prisma.order.count({ where: { status } }),
    ]);

    return {
      data: orders.map(this.mapToEntity),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return order ? this.mapToEntity(order) : null;
  }

  async findByUserId(
    userId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Order>> {
    const { page, limit, orderBy } = pagination;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: orderBy },
        include: { items: true },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders.map(this.mapToEntity),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const totalAmount = this.calculateTotalAmount(createOrderDto.items);

    const order = await this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        totalAmount,
        items: {
          create: createOrderDto.items,
        },
      },
      include: { items: true },
    });

    return this.mapToEntity(order);
  }
  async update(id: string, order: Partial<Order>): Promise<Order> {
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        userId: order.userId,
        totalAmount: order.totalAmount,
        items: {
          create: order.items,
        },
      },
      include: { items: true },
    });
    return this.mapToEntity(updatedOrder);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({ where: { id } });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    return this.mapToEntity(order);
  }

  calculateTotalAmount(items: { quantity: number; price: number }[]): number {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  private mapToEntity(data: any): Order {
    return new Order(
      data.id,
      data.userId,
      data.items.map(this.mapToOrderItemEntity),
      Number(data.totalAmount.toString()),
      data.status,
      data.createdAt,
      data.updatedAt,
    );
  }

  private mapToOrderItemEntity(data: any): OrderItem {
    return new OrderItem(
      data.id,
      data.orderId,
      data.productId,
      data.quantity,
      Number(data.price),
      data.createdAt,
      data.updatedAt,
    );
  }
}
