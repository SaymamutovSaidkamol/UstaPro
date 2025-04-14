import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
  userId: number

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
