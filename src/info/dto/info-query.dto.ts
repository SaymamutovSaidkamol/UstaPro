import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryInfoDto {
  @ApiPropertyOptional({ example: 'example@gmail.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: { website: 'https://google.com' } })
  @IsOptional()
  @IsObject()
  links: Record<string, any>;

  @ApiPropertyOptional({
    example: ['+998901234567', '+998998765432'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phone?: string[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: ['email', 'links', 'phone'],
    example: 'email',
  })
  @IsOptional()
  @IsEnum(['email', 'links', 'phone'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
