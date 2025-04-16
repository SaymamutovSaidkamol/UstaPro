import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class CreateProfessionLevelDto {
      @ApiProperty({ example: 1 })
      @IsNumber()
      professionId: number;
    
      @ApiProperty({ example: 1 })
      @IsNumber()
      levelId: number;
    
      @IsOptional()
      createdAt: Date = new Date();
}
