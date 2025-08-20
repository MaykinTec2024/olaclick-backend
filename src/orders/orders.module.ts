import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrdersRepository } from './repository/orders.repository';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './controller/orders.controller';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem])],
  providers: [OrdersService, OrdersRepository],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
