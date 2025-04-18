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
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/Enums/role.enum';
import { RoleGuard } from 'src/auth/role.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryBrandDto } from 'src/brand/dto/brand-query.dto';
import { QueryLevelDto } from './dto/level-query.dto';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

    // @UseGuards(AuthGuard)
    @Get('/query')
    @ApiOperation({
      summary: 'Levellarni qidirish',
      description:
        'Berilgan parametrlar bo‘yicha Levellarni filterlash, sortlash, pagination',
    })
    @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
    @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
    query(@Query() query: QueryLevelDto, @Req() req: Request) {
      return this.levelService.query(query, req);
    }

  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.levelService.findAll();
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(+id);
  }
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }


  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelService.update(+id, updateLevelDto);
  }

  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelService.remove(+id);
  }
}
