import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateProfessionLevelDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  levelId: number;

  @IsOptional()
  createdAt?: Date = new Date();
}


export class CreateProfessionToolDto {

  @ApiProperty({ example: 1 })
  @IsNumber()
  toolId: number;

  @IsOptional()
  createdAt?: Date = new Date();
}

export class CreateProfessionDto {
  @ApiProperty({ example: 'Santexnik' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'Водопроводчик' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Plumber' })
  @IsString()
  name_en: string;

  @ApiProperty({ example: 'icons.jpg' })
  @IsString()
  img: string;

  @ApiProperty({ example: '1' })
  @IsString()
  minWorkingHours: string;

  @ApiProperty({ example: '120.50' })
  @IsString()
  priceHourly: string;

  @ApiProperty({ example: '12000.50' })
  @IsString()
  priceDaily: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProfessionLevelDto)
  @ApiProperty({
    type: [CreateProfessionLevelDto],
  })
  ProfessionLevel: CreateProfessionLevelDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProfessionToolDto)
  @ApiProperty({
    type: [CreateProfessionToolDto],
  })
  ProfessionTool: CreateProfessionToolDto[];

  @IsOptional()
  createdAt?: Date = new Date();
}
