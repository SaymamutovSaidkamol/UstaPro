import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsObject, IsString } from "class-validator";

export class CreateInfoDto {
    @ApiProperty({ example: 'example@gmail.com' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ example: { website: 'https://google.com', github: 'https://github.com/user' } })
    @IsObject()
    links: Record<string, any>;
  
    @ApiProperty({ example: ['+998901234567', '+998998765432'], type: [String] })
    @IsArray()
    @IsString({ each: true })
    phone: string[];
  
}
