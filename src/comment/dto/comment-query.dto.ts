import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCommentDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'userId raqam bo‘lishi kerak' })
  userId?: number;

  @ApiPropertyOptional({ example: 'message text' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'orderId raqam bo‘lishi kerak' })
  orderId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: ['message', 'userId', 'orderId', 'createdAt'], example: 'message' })
  @IsOptional()
  @IsEnum(['message', 'userId', 'orderId', 'createdAt'], {
    message: 'Noto‘g‘ri sortBy maydoni',
  })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Tartib noto‘g‘ri' })
  order?: 'asc' | 'desc' = 'desc';
}
