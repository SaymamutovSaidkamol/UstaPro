import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentType, TimeUnit } from 'src/Enums/role.enum';

export class QueryOrderDto {
  @ApiPropertyOptional({ example: 'Toshkent' })
  @IsOptional()
  @IsString()
  adress?: string;

  @ApiPropertyOptional({ example: '2025-04-20T00:00:00Z' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: 12000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalPrice?: number;

  @ApiPropertyOptional({ enum: PaymentType, example: 'CASH, CLICK, PAYME' })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @ApiPropertyOptional({ example: 'message' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ enum: OrderStatus, example: 'PENDING, ACCEPTED' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: ['adress', 'date', 'totalPrice', 'paymentType', 'message', 'status'],
    example: 'adress',
  })
  @IsOptional()
  @IsEnum(['adress', 'date', 'totalPrice', 'paymentType', 'message', 'status'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
