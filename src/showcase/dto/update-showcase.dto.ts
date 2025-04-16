import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateShowcaseDto } from './create-showcase.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateShowcaseDto {
  @ApiProperty({ example: 'Showcase nomi (UZ)' })
  @IsString()
  name_uz?: string;

  @ApiProperty({ example: 'Название витрины (RU)' })
  @IsString()
  name_ru?: string;

  @ApiProperty({ example: 'Showcase name (EN)' })
  @IsString()
  name_en?: string;

  @ApiProperty({ example: 'Tavsif (UZ)' })
  @IsString()
  description_uz?: string;

  @ApiProperty({ example: 'Описание (RU)' })
  @IsString()
  description_ru?: string;

  @ApiProperty({ example: 'Description (EN)' })
  @IsString()
  description_en?: string;

  @ApiProperty({ example: 'image.jpg' })
  @IsString()
  image?: string;

  @ApiProperty({ example: 'https://example.com' })
  @IsString()
  link?: string;

  @IsOptional()
  updatedAt?: Date = new Date();
}
