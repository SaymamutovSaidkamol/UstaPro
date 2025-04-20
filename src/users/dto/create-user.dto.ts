import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { UserStatus } from 'src/Enums/role.enum';

export class CreateCompanyIformationDto {
  @IsNumber()
  userId: number;

  @ApiProperty({ example: '1234567', required: true })
  @IsString()
  INN: string;

  @ApiProperty({ example: '345353', required: true })
  @IsString()
  MFO: string;

  @ApiProperty({ example: '236482482534832', required: true })
  @IsString()
  R_S: string;

  @ApiProperty({ example: 'Xalq Bank', required: true })
  @IsString()
  BANK: string;

  @ApiProperty({ example: '242342342', required: true })
  @IsString()
  OKEYD: string;

  @ApiProperty({ example: 'Toshkent', required: true })
  @IsString()
  ADRESS: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Saidkamol', required: true })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'cryptouchun06@gmail.com', required: true })
  @IsString()
  email: string;

  @ApiProperty({ example: '+998943861006', required: true })
  @IsString()
  phone: string;

  @ApiProperty({ example: '1', required: true })
  @IsString()
  regionId: number;

  @ApiProperty({ example: '1234', required: true })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Saidkamol.jpg', required: true })
  @IsString()
  img: string;

  @ApiProperty({
    example: 'USER_FIZ, USER_YUR, VIEWER_ADMIN, ADMIN, SUPERADMIN',
    required: true,
  })
  @IsString()
  role: Role;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompanyIformationDto)
  @ApiProperty({
    type: [CreateCompanyIformationDto],
  })
  UserCompany: CreateCompanyIformationDto[];

  @IsString()
  status: UserStatus;
}

export class AddAdminDto {
  @ApiProperty({ example: 'Saidkamol' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'cryptouchun06@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '+998943861006' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '1' })
  @IsString()
  regionId: number;

  @ApiProperty({ example: '1234' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Saidkamol.jpg' })
  @IsString()
  img: string;

  @ApiProperty({
    example: 'USER_FIZ, USER_YUR, VIEWER_ADMIN, ADMIN, SUPERADMIN',
  })
  @IsString()
  role: Role;

  @IsString()
  status: UserStatus;
}

export class LoginDto {
  @ApiProperty({ example: '+998943861006' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  password: string;
}

export class VerifyDto {
  @ApiProperty({ example: '+998943861006' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string;
}

export class sendOtpDto {
  @ApiProperty({ example: '+998943861006' })
  @IsString()
  phone: string;
}

export class resetPasswordDto {
  @ApiProperty({ example: '+998943861006' })
  @IsString()
  phone: string;
  @ApiProperty({ example: '1234' })
  @IsString()
  password: string;
  @ApiProperty({ example: '234234234' })
  @IsString()
  otp: string;
}

export function isValidPassword(password: string): boolean {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  return password.length >= minLength && hasUpperCase && hasNumber && hasSymbol;
}
