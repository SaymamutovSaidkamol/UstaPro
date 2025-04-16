import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfessionLevelService } from './profession-level.service';
import { CreateProfessionLevelDto } from './dto/create-profession-level.dto';

@Controller('profession-level')
export class ProfessionLevelController {
  constructor(private readonly professionLevelService: ProfessionLevelService) {}

  @Post()
  create(@Body() createProfessionLevelDto: CreateProfessionLevelDto) {
    return this.professionLevelService.create(createProfessionLevelDto);
  }

  @Get()
  findAll() {
    return this.professionLevelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionLevelService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionLevelService.remove(+id);
  }
}
