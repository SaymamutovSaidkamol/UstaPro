import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCompanyIformationDto {
  @ApiProperty({ example: '1234567' })
  @IsString()
  INN: string;

  @ApiProperty({ example: '345353' })
  @IsString()
  MFO: string;

  @ApiProperty({ example: '236482482534832' })
  @IsString()
  R_S: string;

  @ApiProperty({ example: 'Xalq Bank' })
  @IsString()
  BANK: string;

  @ApiProperty({ example: '242342342' })
  @IsString()
  OKEYD: string;

  @ApiProperty({ example: 'Toshkent' })
  @IsString()
  ADRESS: string;
}
