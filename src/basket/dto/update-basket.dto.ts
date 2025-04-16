import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { TimeUnit } from '@prisma/client';

export class UpdateBasketDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  count?: number;

  @IsOptional()
  updatedAt?: Date = new Date();
}
