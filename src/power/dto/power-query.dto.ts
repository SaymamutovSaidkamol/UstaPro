import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPowerDto {
  @ApiPropertyOptional({ example: 'Yosh mutaxassi' })
  @IsOptional()
  @IsString()
  name_uz?: string;

  @ApiPropertyOptional({ example: 'Младший специалист' })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiPropertyOptional({ example: 'Junior' })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: ['name_uz', 'name_ru', 'name_en'],
    example: 'name_uz',
  })
  @IsOptional()
  @IsEnum(['name_uz', 'name_ru', 'name_en'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
