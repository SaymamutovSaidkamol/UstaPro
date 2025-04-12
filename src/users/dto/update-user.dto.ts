import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString } from 'class-validator';
import { UserStatus } from 'src/Enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({ example: ['USER', 'ADMIN', 'SUPERADMIN'] })
  @IsString()
  role?: Role;

  @ApiProperty({ example: ['ACTIVE', 'INACTIVE'] })
  @IsString()
  status?: UserStatus;
}

