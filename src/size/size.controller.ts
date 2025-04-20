import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuerySizeDto } from './dto/size-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/Enums/role.enum';
import { Roles } from 'src/decorators/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @UseGuards(AuthGuard)
  @Get('/query')
  @ApiOperation({
    summary: 'Masterlarni qidirish',
    description:
      'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  query(@Query() query: QuerySizeDto, @Req() req: Request) {
    return this.sizeService.query(query, req);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.sizeService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizeService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizeService.update(+id, updateSizeDto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizeService.remove(+id);
  }
}
