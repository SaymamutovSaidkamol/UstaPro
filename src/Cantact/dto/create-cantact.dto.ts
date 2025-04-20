import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCantactDto {
  @IsNumber()
  userId: number;

  @ApiProperty({ example: "Pulatov Diyorbek" })
  @IsString()
  full_name: string;

  @ApiProperty({ example: "+998941234567" })
  @IsString()
  phone: string;

  @ApiProperty({ example: "Toshkent" })
  @IsString()
  address: string;

  @ApiProperty({ example: "Salom" })
  @IsString()
  message: string;

  @IsOptional()
  createdAt?: Date = new Date();
}
