import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '../entities/order.entity';
import { mapCreateOrderDtoToEntity } from '../mappers/order.mapper';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(OrderItem) private readonly itemModel: typeof OrderItem,
  ) {}

  async findAllPending(): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { status: [OrderStatus.INITIATED, OrderStatus.SENT] },
      include: [OrderItem],
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number): Promise<Order | null> {
    return this.orderModel.findByPk(id, { include: [OrderItem] });
  }

  async createOrder(dto: CreateOrderDto): Promise<Order> {
  const entity = mapCreateOrderDtoToEntity(dto);
  return this.orderModel.create(entity, { include: [OrderItem] });
}

  async updateStatus(id: number, status: OrderStatus): Promise<[number, Order[]]> {
    return this.orderModel.update({ status }, { where: { id }, returning: true });
  }

  async delete(id: number): Promise<void> {
    await this.itemModel.destroy({ where: { orderId: id } });
    await this.orderModel.destroy({ where: { id } });
  }
}
