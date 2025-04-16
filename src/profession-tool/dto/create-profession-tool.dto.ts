import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateProfessionToolDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  professionId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  toolId: number;

  @IsOptional()
  createdAt: Date = new Date();
}
