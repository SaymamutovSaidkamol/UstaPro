import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateSizeDto {
      @ApiProperty({ example: 'S' })
      @IsString()
      name_uz: string;
    
      @ApiProperty({ example: 'S' })
      @IsString()
      name_ru: string;
    
      @ApiProperty({ example: 'S' })
      @IsString()
      name_en: string;
    
      @IsOptional()
      createdAt?: Date = new Date();
}
