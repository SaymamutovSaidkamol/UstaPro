import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFaqDto } from './create-faq.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFaqDto {
      @ApiProperty({ example: 'salom' })
      @IsString()
      question_uz?: string;
    
      @ApiProperty({ example: 'привет' })
      @IsString()
      question_ru?: string;
    
      @ApiProperty({ example: 'hello' })
      @IsString()
      question_en?: string;
    
      @ApiProperty({ example: 'alik' })
      @IsString()
      answer_uz?: string;
    
      @ApiProperty({ example: 'алик' })
      @IsString()
      answer_ru?: string;
    
      @ApiProperty({ example: 'alik' })
      @IsString()
      answer_en?: string;
    
      @IsOptional()
      updatedAt?: Date = new Date();
}
