import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLevelDto {
    @ApiProperty({ example: 'Yosh mutaxassi' })
    @IsString()
    name_uz?: string;
  
    @ApiProperty({ example: 'Младший специалист' })
    @IsString()
    name_ru?: string;
  
    @ApiProperty({ example: 'Junior' })
    @IsString()
    name_en?: string;
  
    @IsOptional()
    updatedAt?: Date = new Date();
}
