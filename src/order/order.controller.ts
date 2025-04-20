import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enums/role.enum';
import { RoleGuard } from 'src/auth/role.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryOrderDto } from './dto/query-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/query')
  @ApiOperation({
    summary: 'Orderlarni qidirish',
    description:
      'Berilgan parametrlar bo‘yicha Orderlarni filterlash, sortlash, pagination',
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  query(@Query() query: QueryOrderDto, @Req() req: Request) {
    return this.orderService.query(query, req);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req);
  }

  @UseGuards(AuthGuard)
  @Get('my-orders')
  myOrder(@Req() req: Request) {
    return this.orderService.myOrder(req);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.VIEWER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.orderService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.orderService.findOne(+id, req);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  Update(
    @Param('id') id: string,
    @Body() data: UpdateOrderDto,
    @Req() req: Request,
  ) {
    return this.orderService.update(+id, data, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.orderService.remove(+id, req);
  }
}
