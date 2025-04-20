import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateMasterRatingDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  masterId: number;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  star: number;
}

export class CreateCommentDto {
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({
    type: [CreateMasterRatingDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMasterRatingDto)
  masterRatings: CreateMasterRatingDto[];
}
