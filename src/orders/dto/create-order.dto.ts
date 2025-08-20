import { IsNotEmpty, IsString, ValidateNested, IsArray, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsPositive()
  unitPrice: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
