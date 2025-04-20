import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString } from 'class-validator';
import { UserStatus } from 'src/Enums/role.enum';

export class UpdateUserForAdminDto {
  @ApiProperty({
    example: Role.ADMIN,
    description: `${Role.ADMIN}, ${Role.MASTER}, ${Role.SUPER_ADMIN}, ${Role.USER_FIZ}, ${Role.USER_YUR}, ${Role.VIEWER_ADMIN}`,
  })
  @IsString()
  role?: Role;

  @ApiProperty({ example: UserStatus.ACTIVE })
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
