import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({ example: OrderStatus.ACCEPTED })
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ example: 1 })
  @IsArray()
  masterId?: number[];

  @IsOptional()
  updatedAt: Date = new Date();
}
