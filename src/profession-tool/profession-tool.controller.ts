import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfessionToolService } from './profession-tool.service';
import { CreateProfessionToolDto } from './dto/create-profession-tool.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enums/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('profession-tool')
export class ProfessionToolController {
  constructor(private readonly professionToolService: ProfessionToolService) {}

  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
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

  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionToolService.remove(+id);
  }
}
