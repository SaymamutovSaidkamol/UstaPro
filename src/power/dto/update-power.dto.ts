import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePowerDto } from './create-power.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePowerDto extends PartialType(CreatePowerDto) {
  @ApiProperty({ example: 'Elektr quvvati' })
  @IsString()
  name_uz?: string;

  @ApiProperty({ example: 'Электроэнергия' })
  @IsString()
  name_ru?: string;

  @ApiProperty({ example: 'Electric power' })
  @IsString()
  name_en?: string;

  @IsOptional()
  updatedAt?: Date = new Date();
}
