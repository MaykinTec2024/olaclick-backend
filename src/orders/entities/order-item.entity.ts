import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from './order.entity';

export interface OrderItemAttributes {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  orderId?: number;
}

export type OrderItemCreationAttributes = Omit<OrderItemAttributes, 'id'>;

@Table({ tableName: 'order_items', timestamps: true })
export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  unitPrice: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;
}
