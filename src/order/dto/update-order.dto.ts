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

export class UpdateOrderDto {
  @ApiProperty({example: ['PENDING', 'ACCEPTED',]})
  @IsString()
  status?: OrderStatus;

  @ApiProperty({example: 1})
  @IsNumber()
  masterId?: number;

  @IsOptional()
  updatedAt: Date = new Date();
}
