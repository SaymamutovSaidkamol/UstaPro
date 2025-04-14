import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MasterService } from './master.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enums/role.enum';
import { RoleGuard } from 'src/auth/role.guard';
import { Request } from 'express';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { QueryMasterDto } from './dto/query-master.dto';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @UseGuards(AuthGuard)
  @Get('/query')
  @ApiOperation({
    summary: 'Masterlarni qidirish',
    description:
      'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  query(@Query() query: QueryMasterDto, @Req() req: Request) {
    return this.masterService.query(query, req);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  findAll() {
    return this.masterService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.USER_FIZ, Role.USER_YUR)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createMasterDto: CreateMasterDto) {
    return this.masterService.create(createMasterDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateMasterDto,
    @Req() req: Request,
  ) {
    return this.masterService.update(+id, data, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.masterService.remove(+id, req);
  }
}
