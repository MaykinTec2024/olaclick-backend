import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderCreationAttributes, OrderStatus } from '../entities/order.entity';
import { OrderItemCreationAttributes } from '../entities/order-item.entity';

export function mapCreateOrderDtoToEntity(
  dto: CreateOrderDto,
): OrderCreationAttributes & { items: OrderItemCreationAttributes[] } {
  return {
    clientName: dto.clientName,
    status: OrderStatus.INITIATED,
    items: dto.items.map(
      (item): OrderItemCreationAttributes => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }),
    ),
  };
}
