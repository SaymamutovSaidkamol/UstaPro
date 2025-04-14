import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateMasterDto {
  @ApiProperty({ example: 'Jalilov Boxodir' })
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '+998941234567' })
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'true and false', default: true })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '04.08.2006' })
  @IsString()
  birthYear?: string;

  @ApiProperty({ example: 'example.jpg' })
  @IsString()
  img?: string;

  @ApiProperty({ example: 'Santexnik usta' })
  @IsString()
  about?: string;

  @IsOptional()
  updatedAt?: Date = new Date();
}
