import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePartnerDto } from './create-partner.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePartnerDto {
    @ApiProperty({ example: 'Partner nomi (UZ)' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'Название партнёра (RU)' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Partner name (EN)' })
  @IsString()
  name_en: string;

  @ApiProperty({ example: 'image.jpg' })
  @IsString()
  image: string;

  @IsOptional()
  updatedAt?: Date = new Date();
}
