import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryBrandDto } from './dto/brand-query.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  
    // @UseGuards(AuthGuard)
    @Get('/query')
    @ApiOperation({
      summary: 'Masterlarni qidirish',
      description:
        'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
    })
    @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
    @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
    query(@Query() query: QueryBrandDto, @Req() req: Request) {
      return this.brandService.query(query, req);
    }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.brandService.findOne(+id);
    }
  
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
