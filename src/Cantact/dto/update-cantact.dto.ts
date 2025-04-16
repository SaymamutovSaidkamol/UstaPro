import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCantactDto {
  @ApiProperty({ example: 'Pulatov Diyorbek' })
  @IsString()
  full_name?: string;

  @ApiProperty({ example: '+998941234567' })
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Toshkent' })
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Salom' })
  @IsString()
  message?: string;

  @IsOptional()
  updatedAt?: Date = new Date();
}
