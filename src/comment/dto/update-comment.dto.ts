import {
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    Min,
    Max,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateMasterRatingDto {
    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    masterId?: number;
  
    @ApiProperty({ example: 2.5, required: false})
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    star?: number;
  }
  
  export class UpdateCommentDto {
    @ApiProperty({ example: 'Message', required: false })
    @IsOptional()
    @IsString()
    message?: string;
  
    @ApiProperty({
      type: [UpdateMasterRatingDto],
      required: false
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateMasterRatingDto)
    masterRatings?: UpdateMasterRatingDto[];
  }