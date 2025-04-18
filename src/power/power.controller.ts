import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { PowerService } from './power.service';
import { CreatePowerDto } from './dto/create-power.dto';
import { UpdatePowerDto } from './dto/update-power.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryPowerDto } from './dto/power-query.dto';

@Controller('power')
export class PowerController {
  constructor(private readonly powerService: PowerService) {}

    // @UseGuards(AuthGuard)
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

  @Post()
  create(@Body() createPowerDto: CreatePowerDto) {
    return this.powerService.create(createPowerDto);
  }

  @Get()
  findAll() {
    return this.powerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.powerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePowerDto: UpdatePowerDto) {
    return this.powerService.update(+id, updatePowerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.powerService.remove(+id);
  }
}
