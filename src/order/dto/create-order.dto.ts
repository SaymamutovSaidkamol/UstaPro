import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'Toshkent' })
  @IsString()
  adress: string;

  @ApiProperty({ example: '2025-04-20T00:00:00Z' })
  @IsString()
  date: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  isPaid: boolean;

  @ApiProperty({ example: ['CASH', 'CLICK', 'PAYME'] })
  @IsString()
  paymentType: PaymentType;

  @ApiProperty({ example: false })
  @IsBoolean()
  withDelivery: boolean;

  @ApiProperty({ example: 'Message' })
  @IsString()
  message?: string;

  @IsString()
  status?: OrderStatus;

  @IsOptional()
  createdAt: Date = new Date();
}
