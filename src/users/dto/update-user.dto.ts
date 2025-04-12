import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString } from 'class-validator';
import { UserStatus } from 'src/Enums/role.enum';

export class UpdateUserForAdminDto {
  @ApiProperty({
    example: ['VIEWER_ADMIN', 'USER_FIZ', 'USER_YUR', 'ADMIN', 'SUPERADMIN'],
  })
  @IsString()
  role?: Role;

  @ApiProperty({ example: ['ACTIVE', 'INACTIVE'] })
  @IsString()
  status?: UserStatus;
}

export class UpdateUserForUserDto {
  @ApiProperty({ example: 'Saidkamol' })
  @IsString()
  fullName?: string;

  @ApiProperty({ example: 'cryptouchun06@gmail.com' })
  @IsString()
  email?: string;

  @ApiProperty({ example: '+998943861006' })
  @IsString()
  phone?: string;

  @ApiProperty({ example: '1' })
  @IsString()
  regionId?: number;

  @ApiProperty({ example: 'Saidkamol.jpg' })
  @IsString()
  img?: string;
}
