import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/Enums/role.enum';

@Controller('profession')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) {}

  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionService.create(createProfessionDto);
  }

  @Get()
  findAll() {
    return this.professionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfessionDto: UpdateProfessionDto) {
    return this.professionService.update(+id, updateProfessionDto);
  }
  
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionService.remove(+id);
  }
}
