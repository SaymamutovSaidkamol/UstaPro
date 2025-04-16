import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class BasketService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateBasketDto, req: Request) {
    try {
      data.userId = req['user'].id;

      let checkUser = await this.prisma.users.findFirst({
        where: { id: data.userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User Not found');
      }

      let checkProf = await this.prisma.profession.findFirst({
        where: { id: data.professionId },
      });

      if (!checkProf) {
        throw new NotFoundException('Profession Not found');
      }

      let checkTool = await this.prisma.tool.findFirst({
        where: { id: data.toolId },
      });

      if (!checkTool) {
        throw new NotFoundException('Tool Not found');
      }

      let checkLivel = await this.prisma.level.findFirst({
        where: { id: data.livelId },
      });

      if (!checkLivel) {
        throw new NotFoundException('Livel Not found');
      }

      return { data: await this.prisma.basket.create({ data }) };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll(req: Request) {
    try {
      let id = req['user'].id;

      let data = await this.prisma.basket.findFirst({ where: { userId: id } });

      return { data };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateBasketDto, req: Request) {
    try {
      let checkBas = await this.prisma.basket.findUnique({ where: { id } });

      if (!checkBas) {
        throw new NotFoundException('Basket not found');
      }

      if (req['user'].id != id) {
        throw new BadRequestException(
          "Sorry, you can't change other people's information.",
        );
      }

      return {
        message: 'Basket updated Successfully',
        data: await this.prisma.basket.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      let checkBas = await this.prisma.basket.findUnique({ where: { id } });

      if (!checkBas) {
        throw new NotFoundException('Basket not found');
      }

      if (req['user'].id != id) {
        throw new BadRequestException(
          "Sorry, you can't change other people's information.",
        );
      }

      return {
        message: 'Basket deleted successfully!',
        data: await this.prisma.basket.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }
}
