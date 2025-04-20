import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PowerService } from './power.service';
import { CreatePowerDto } from './dto/create-power.dto';
import { UpdatePowerDto } from './dto/update-power.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryPowerDto } from './dto/power-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/Enums/role.enum';
import { Roles } from 'src/decorators/role.decorator';

@Controller('power')
export class PowerController {
  constructor(private readonly powerService: PowerService) {}

  @UseGuards(AuthGuard)
  @Get('/query')
  @ApiOperation({
    summary: 'Powerlarni qidirish',
    description:
      'Berilgan parametrlar bo‘yicha Powerlarni filterlash, sortlash, pagination',
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  query(@Query() query: QueryPowerDto, @Req() req: Request) {
    return this.powerService.query(query, req);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createPowerDto: CreatePowerDto) {
    return this.powerService.create(createPowerDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.powerService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.powerService.findOne(+id);
  }

  
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePowerDto: UpdatePowerDto) {
    return this.powerService.update(+id, updatePowerDto);
  }
  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.powerService.remove(+id);
  }
}
