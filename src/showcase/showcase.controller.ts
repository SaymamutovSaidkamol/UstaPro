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
import { ShowcaseService } from './showcase.service';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryShowcaseDto } from './dto/showcase-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/Enums/role.enum';
import { Roles } from 'src/decorators/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  @UseGuards(AuthGuard)
  @Get('/query')
  @ApiOperation({
    summary: 'Masterlarni qidirish',
    description:
      'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  query(@Query() query: QueryShowcaseDto, @Req() req: Request) {
    return this.showcaseService.query(query, req);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createShowcaseDto: CreateShowcaseDto) {
    return this.showcaseService.create(createShowcaseDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.showcaseService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showcaseService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowcaseDto: UpdateShowcaseDto,
  ) {
    return this.showcaseService.update(+id, updateShowcaseDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showcaseService.remove(+id);
  }
}
