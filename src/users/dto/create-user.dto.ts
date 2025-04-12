import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString } from 'class-validator';
import { UserStatus } from 'src/Enums/role.enum';

export class RegisterDto {
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
    example: ['USER_FIZ', 'USER_YUR', 'VIEWER_ADMIN', 'ADMIN', 'SUPERADMIN'],
  })
  @IsString()
  role: Role;

  @ApiProperty({ example: 1 })
  @IsString()
  companyId?: number;

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
