import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ example: 'drel' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'дрель' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'drill' })
  @IsString()
  name_en: string;

  @ApiProperty({ example: 'Murvat qotirish' })
  @IsString()
  description_uz: string;

  @ApiProperty({ example: 'Затянуть болт yoki Затянуть винт' })
  @IsString()
  description_ru: string;

  @ApiProperty({ example: 'To tighten a bolt yoki To tighten a screw' })
  @IsString()
  description_en: string;

  @ApiProperty({ example: '10000' })
  @IsString()
  price: string;

  @ApiProperty({ example: 27 })
  @IsNumber()
  quantity: number;

  @IsString()
  code: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  brandId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  powerId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  sizeId?: number;

  @ApiProperty({ example: 'image.jpg' })
  @IsString()
  img: string;

  @ApiProperty({ example: true})
  @IsBoolean()
  isAvailable: boolean;

  @IsOptional()
  createdAt?: Date = new Date();
}
