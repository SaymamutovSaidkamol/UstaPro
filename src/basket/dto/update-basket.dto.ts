import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TimeUnit } from 'src/Enums/role.enum';

export class UpdateBasketDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  professionId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  toolId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  levelId?: number;

  @ApiProperty({ example: 1, required: false, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiProperty({ enum: TimeUnit, example: 'HOURLY', required: false })
  @IsOptional()
  @IsEnum(TimeUnit)
  timeUnit?: TimeUnit;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  workingTime?: number;

  @ApiProperty({ example: 4000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  updatedAt?: Date = new Date();
}
