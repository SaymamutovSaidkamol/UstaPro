import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfessionToolService } from './profession-tool.service';
import { CreateProfessionToolDto } from './dto/create-profession-tool.dto';

@Controller('profession-tool')
export class ProfessionToolController {
  constructor(private readonly professionToolService: ProfessionToolService) {}

  @Post()
  create(@Body() createProfessionToolDto: CreateProfessionToolDto) {
    return this.professionToolService.create(createProfessionToolDto);
  }

  @Get()
  findAll() {
    return this.professionToolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionToolService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionToolService.remove(+id);
  }
}
