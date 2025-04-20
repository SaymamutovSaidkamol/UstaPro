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
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryPartnersDto } from './dto/partners-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/Enums/role.enum';
import { Roles } from 'src/decorators/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @UseGuards(AuthGuard)
  @Get('/query')
  @ApiOperation({
    summary: 'Masterlarni qidirish',
    description:
      'Berilgan parametrlar bo‘yicha masterlarni filterlash, sortlash, pagination',
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  query(@Query() query: QueryPartnersDto, @Req() req: Request) {
    return this.partnersService.query(query, req);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(+id);
  }

  
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(+id, updatePartnerDto);
  }

  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnersService.remove(+id);
  }
}
