import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { TimeUnit } from 'src/Enums/role.enum';

export class CreateBasketDto {
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  professionId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  toolId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  livelId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'DAILY, HOURLY' })
  @IsString()
  timeUnit: TimeUnit;

  @ApiProperty({ example: 1 })
  @IsNumber()
  workingTime: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  price: number;

  @IsOptional()
  createdAt?: Date = new Date();
}
