import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class QueryMasterDto {
    @ApiPropertyOptional({ example: 'Jalilov Boxodir' })
    @IsOptional()
    @IsString()
    fullName?: string;
  
    @ApiPropertyOptional({ example: '+998941234567' })
    @IsOptional()
    @IsString()
    phoneNumber?: string;
  
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    userId?: number;
  
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;
  
    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;
  
    @ApiPropertyOptional({ enum: ['fullName', 'phoneNumber', 'userId'], example: 'fullName' })
    @IsOptional()
    @IsEnum(['fullName', 'phoneNumber', 'userId'])
    sortBy?: string = 'createdAt';
  
    @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    order?: 'asc' | 'desc' = 'desc';
  }