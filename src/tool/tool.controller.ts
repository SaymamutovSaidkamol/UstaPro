import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryToolDto } from './dto/tool-query.dto';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  
    // @UseGuards(AuthGuard)
    @Get('/query')
    @ApiOperation({
      summary: 'Masterlarni qidirish',
      description:
        'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
    })
    @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
    @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
    query(@Query() query: QueryToolDto, @Req() req: Request) {
      return this.toolService.query(query, req);
    }

  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @Get()
  findAll() {
    return this.toolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(+id, updateToolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolService.remove(+id);
  }
}
