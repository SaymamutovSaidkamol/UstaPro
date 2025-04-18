import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProfessionToolDto } from 'src/profession/dto/create-profession.dto';

export class CreateMasterProfessionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  professionId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  minWorkingHours: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  levelId: number;

  @ApiProperty({ example: '10000' })
  @IsString()
  priceHourly: string;

  @ApiProperty({ example: '3000000' })
  @IsString()
  priceDaily: string;

  @ApiProperty({ example: 23 })
  @IsNumber()
  experience: number;

  @IsNumber()
  masterId: number;
}

export class CreateMasterDto {
  @ApiProperty({ example: 'Jalilov Boxodir' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+998941234567' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'true and false', default: true })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '04.08.2006' })
  @IsString()
  birthYear: string;

  @ApiProperty({ example: 'example.jpg' })
  @IsString()
  img: string;

  @ApiProperty({ example: 'passportImg.jpg' })
  @IsString()
  passportImg: string;

  @ApiProperty({ example: 'Santexnik usta' })
  @IsString()
  about: string;

  @ApiProperty({ example: '1' })
  @IsString()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMasterProfessionDto)
  @ApiProperty({
    type: [CreateMasterProfessionDto],
  })
  MasterProfession: CreateMasterProfessionDto[];

  @IsOptional()
  createdAt?: Date = new Date();
}

export function isValidUzbekPhoneNumber(phoneNumber: string): boolean {
  // Bo‘sh joylar va tirelarni olib tashlaymiz
  const cleaned = phoneNumber.replace(/[\s\-]/g, '');

  // Regex pattern
  const regex = /^\+998(33|88|9[0-5|7-9])\d{7}$/;

  return regex.test(cleaned);
}
