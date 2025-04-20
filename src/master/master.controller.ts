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

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
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

  @UseGuards(AuthGuard)
  @Get('get-me')
  GetMe(@Req() req: Request) {
    return this.masterService.getMe(req);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  findAll() {
    return this.masterService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.masterService.findOne(+id, req);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMasterDto: CreateMasterDto, @Req() req: Request) {
    return this.masterService.create(createMasterDto, req);
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
