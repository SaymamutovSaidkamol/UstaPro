import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePowerDto {
  @ApiProperty({ example: 'Elektr quvvati' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'Электроэнергия' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Electric power' })
  @IsString()
  name_en: string;

  @IsOptional()
  createdAt?: Date = new Date();
}
