import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSizeDto  {
  @ApiProperty({ example: 'S' })
  @IsString()
  name_uz?: string;

  @ApiProperty({ example: 'S' })
  @IsString()
  name_ru?: string;

  @ApiProperty({ example: 'S' })
  @IsString()
  name_en?: string;

  @IsOptional()
  updatedAt?: Date = new Date();
}
