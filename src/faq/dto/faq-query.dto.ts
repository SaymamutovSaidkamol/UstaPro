import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryFaqDto {

  @ApiPropertyOptional({ example: 'salom' })
  @IsOptional()
  @IsString()
  question_uz?: string;

  @ApiPropertyOptional({ example: 'привет' })
  @IsOptional()
  @IsString()
  question_ru?: string;

  @ApiPropertyOptional({ example: 'hello' })
  @IsOptional()
  @IsString()
  question_en?: string;

  @ApiPropertyOptional({ example: 'alik' })
  @IsOptional()
  @IsString()
  answer_uz?: string;

  @ApiPropertyOptional({ example: 'alik' })
  @IsOptional()
  @IsString()
  answer_ru?: string;

  @ApiPropertyOptional({ example: 'alik' })
  @IsOptional()
  @IsString()
  answer_en?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: ['question_uz', 'question_ru', 'question_en', 'answer_uz', 'answer_ru', 'answer_en'],
    example: 'question_uz',
  })
  @IsOptional()
  @IsEnum(['question_uz', 'question_ru', 'question_en', 'answer_uz', 'answer_ru', 'answer_en'])
  sortBy?: string = 'question_uz';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
