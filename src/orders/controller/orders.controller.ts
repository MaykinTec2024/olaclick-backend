import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from '../service/orders.service';
import { Order } from '../entities/order.entity';
import { IdParamDto } from '../dto/id-param.dto';
import { CreateOrderDto } from '../dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  async getAll(): Promise<Order[]> {
    return this.service.getAll();
  }

  @Get(':id')
  async getById(@Param() params: IdParamDto): Promise<Order> {
    return this.service.getById(params.id);
  }

  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.service.create(dto);
  }

  @Post(':id/advance')
  async advance(@Param() params: IdParamDto): Promise<{ message: string }> {
    const message = await this.service.advanceStatus(params.id);
    return { message };
  }
}
