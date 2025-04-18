import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { TimeUnit } from 'src/Enums/role.enum';

export class CreateOrderProductDto {
  @IsOptional()
  @IsNumber()
  orderId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  professionId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  toolId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: false })
  levelId?: number;

  @IsNumber()
  @ApiProperty({ description: 'Quantity', example: 1 })
  quantity: number;

  @IsEnum(TimeUnit)
  @ApiProperty({ enum: TimeUnit, example: ['HOURLY', 'DAILY'] })
  timeUnit: TimeUnit;

  @IsNumber()
  @ApiProperty({ example: 8 })
  workingTime: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 100.0 })
  price: number;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  @ApiProperty({
    type: [CreateOrderProductDto]
  })
  orderProducts: CreateOrderProductDto[];
}
