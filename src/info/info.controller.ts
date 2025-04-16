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
} from '@nestjs/common';
import { InfoService } from './info.service';
import { CreateInfoDto } from './dto/create-info.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryInfoDto } from './dto/info-query.dto';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  // @UseGuards(AuthGuard)
  @Get('/query')
  @ApiOperation({
    summary: 'Masterlarni qidirish',
    description:
      'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  query(@Query() query: QueryInfoDto, @Req() req: Request) {
    return this.infoService.query(query, req);
  }

  @Post()
  create(@Body() createInfoDto: CreateInfoDto) {
    return this.infoService.create(createInfoDto);
  }

  @Get()
  findAll() {
    return this.infoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInfoDto: UpdateInfoDto) {
    return this.infoService.update(+id, updateInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infoService.remove(+id);
  }
}
