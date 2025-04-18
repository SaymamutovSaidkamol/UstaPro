import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProfessionDto {
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

  @ApiPropertyOptional({ example: '500000' })
  @IsOptional()
  @IsString()
  minWorkingHours?: string;

  @ApiPropertyOptional({ example: '20000' })
  @IsOptional()
  @IsString()
  priceHourly?: string;

  @ApiPropertyOptional({ example: '1000' })
  @IsOptional()
  @IsString()
  priceDaily?: string;

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
      'minWorkingHours',
      'priceHourly',
      'priceDaily',
    ],
    example: 'name_uz',
  })
  @IsOptional()
  @IsEnum([
    'name_uz',
    'name_ru',
    'name_en',
    'minWorkingHours',
    'priceHourly',
    'priceDaily',
  ])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
