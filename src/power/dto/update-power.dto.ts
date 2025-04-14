import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePowerDto } from './create-power.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePowerDto extends PartialType(CreatePowerDto) {
  @ApiProperty({ example: 'Yosh mutaxassi' })
  @IsString()
  name_uz?: string;

  @ApiProperty({ example: 'Младший специалист' })
  @IsString()
  name_ru?: string;

  @ApiProperty({ example: 'Junior' })
  @IsString()
  name_en?: string;

  @IsOptional()
  updatedAt?: Date = new Date();
}
