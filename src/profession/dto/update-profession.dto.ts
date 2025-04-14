import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfessionDto {
  @ApiProperty({ example: 'Santexnik' })
  @IsString()
  name_uz?: string;

  @ApiProperty({ example: 'Водопроводчик' })
  @IsString()
  name_ru?: string;

  @ApiProperty({ example: 'Plumber' })
  @IsString()
  name_en?: string;

  @ApiProperty({ example: 'icons.jpg' })
  @IsString()
  img?: string;

  @ApiProperty({ example: '1' })
  @IsString()
  minWorkingHours?: string;

  @ApiProperty({ example: '10$' })
  @IsString()
  priceHourly?: string;

  @ApiProperty({ example: '100$' })
  @IsString()
  priceDaily?: string;

  @IsOptional()
  createdAt?: Date = new Date();
}
