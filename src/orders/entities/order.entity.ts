import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  INITIATED = 'initiated',
  SENT = 'sent',
  DELIVERED = 'delivered',
}

export interface OrderAttributes {
  id?: number;
  clientName: string;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderCreationAttributes = Omit<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'>;

@Table({ tableName: 'orders', timestamps: true })
export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare clientName: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    defaultValue: OrderStatus.INITIATED,
  })
  declare status: OrderStatus;

  @HasMany(() => OrderItem)
  declare items?: OrderItem[];
}
