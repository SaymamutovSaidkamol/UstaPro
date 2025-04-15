import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
      @ApiProperty({ example: 'samsung' })
      @IsString()
      name_uz: string;
    
      @ApiProperty({ example: 'samsung' })
      @IsString()
      name_ru: string;
    
      @ApiProperty({ example: 'samsung' })
      @IsString()
      name_en: string;
    
      @IsOptional()
      createdAt?: Date = new Date();
}
