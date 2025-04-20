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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.infoService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.infoService.findOne(+id, req);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCantactDto, @Req() req: Request) {
    return this.infoService.update(+id, data, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.infoService.remove(+id, req);
  }
}
