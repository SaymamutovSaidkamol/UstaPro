import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyIformationService } from './company-iformation.service';
import { CreateCompanyIformationDto } from './dto/create-company-iformation.dto';
import { UpdateCompanyIformationDto } from './dto/update-company-iformation.dto';

@Controller('company-iformation')
export class CompanyIformationController {
  constructor(private readonly companyIformationService: CompanyIformationService) {}

  @Post()
  create(@Body() createCompanyIformationDto: CreateCompanyIformationDto) {
    return this.companyIformationService.create(createCompanyIformationDto);
  }

  @Get()
  findAll() {
    return this.companyIformationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.companyIformationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCompanyIformationDto: UpdateCompanyIformationDto) {
    return this.companyIformationService.update(id, updateCompanyIformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.companyIformationService.remove(id);
  }
}
