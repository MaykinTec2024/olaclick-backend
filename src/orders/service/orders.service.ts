import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { OrdersRepository } from '../repository/orders.repository';
import { Order, OrderStatus } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly repo: OrdersRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getAll(): Promise<Order[]> {
    const cacheKey = 'orders:pending';

    const cached = await this.cache.get<Order[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const orders = await this.repo.findAllPending();
    await this.cache.set(cacheKey, orders, 30_000);
    return orders;
  }

  async getById(id: number): Promise<Order> {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = await this.repo.createOrder(dto);
    await this.cache.del('orders:pending');
    return order;
  }

  async advanceStatus(id: number): Promise<string> {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);

    let nextStatus: OrderStatus;
    const currentStatus = order.status as OrderStatus; 

    switch (currentStatus) {
      case OrderStatus.INITIATED:
        nextStatus = OrderStatus.SENT;
        break;
      case OrderStatus.SENT:
        nextStatus = OrderStatus.DELIVERED;
        break;
      case OrderStatus.DELIVERED:
        throw new BadRequestException('Order already delivered');
      default:
        throw new BadRequestException(`Unknown order status: ${order.status}`);
    }

    if (nextStatus === OrderStatus.DELIVERED) {
      await this.repo.delete(id);
      await this.cache.del('orders:pending');
      return 'Order delivered and removed';
    } else {
      await this.repo.updateStatus(id, nextStatus);
      await this.cache.del('orders:pending');
      return `Order status updated to ${nextStatus}`;
    }
  }
}
