import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRegionDto {
  @ApiProperty({ example: 'Namangan' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'Namangan' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Namangan' })
  @IsString()
  name_en: string;
}
