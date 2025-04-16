import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryFaqDto } from './dto/faq-query.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

    // @UseGuards(AuthGuard)
    @Get('/query')
    @ApiOperation({
      summary: 'Masterlarni qidirish',
      description:
        'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
    })
    @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
    @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
    query(@Query() query: QueryFaqDto, @Req() req: Request) {
      return this.faqService.query(query, req);
    }

  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  findAll() {
    return this.faqService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(+id, updateFaqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(+id);
  }
}
