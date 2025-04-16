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
import { CantactService } from './cantact.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryCantactDto } from './dto/cantact-query.dto';
import { CreateCantactDto } from './dto/create-cantact.dto';
import { UpdateCantactDto } from './dto/update-cantact.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cantact')
export class CantactController {
  constructor(private readonly infoService: CantactService) {}

  // @UseGuards(AuthGuard)
  @Get('/query')
  @ApiOperation({
    summary: 'Masterlarni qidirish',
    description:
      'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  query(@Query() query: QueryCantactDto, @Req() req: Request) {
    return this.infoService.query(query, req);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: CreateCantactDto, @Req() req: Request) {
    return this.infoService.create(data, req);
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
  update(@Param('id') id: string, @Body() data: UpdateCantactDto) {
    return this.infoService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infoService.remove(+id);
  }
}
