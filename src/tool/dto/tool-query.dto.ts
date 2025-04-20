import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryToolDto {
  @ApiPropertyOptional({ example: 'samsung' })
  @IsOptional()
  @IsString()
  name_uz?: string;

  @ApiPropertyOptional({ example: 'samsung' })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiPropertyOptional({ example: 'samsung' })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiPropertyOptional({ example: '10000' })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiPropertyOptional({ example: 27 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ example: '#CODE_1213' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brandId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  powerId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: [
      'name_uz',
      'name_ru',
      'name_en',
      'price',
      'quantity',
      'brandId',
      'powerId',
      'sizeId',
    ],
    example: 'fullName',
  })
  @IsOptional()
  @IsEnum([
    'name_uz',
    'name_ru',
    'name_en',
    'price',
    'quantity',
    'brandId',
    'powerId',
    'sizeId',
  ])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
