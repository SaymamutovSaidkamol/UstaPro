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
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBasketDto: CreateBasketDto, @Req() req: Request) {
    return this.basketService.create(createBasketDto, req);
  }

  @UseGuards(AuthGuard)
  @Get('my-basket')
  MyBasket(@Req() req: Request) {
    return this.basketService.myBasket(req);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.basketService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBasketDto: UpdateBasketDto,
    @Req() req: Request,
  ) {
    return this.basketService.update(+id, updateBasketDto, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.basketService.remove(+id, req);
  }
}
