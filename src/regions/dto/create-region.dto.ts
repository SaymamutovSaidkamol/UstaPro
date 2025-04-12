import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({ example: 'Namangan' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'Наманган' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Namangan' })
  @IsString()
  name_en: string;
}
