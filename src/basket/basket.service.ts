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

  async create(dto: CreateBasketDto, req: Request) {
    try {
      let userId = req['user'].userId;
      if (!dto.professionId && !dto.toolId) {
        throw new BadRequestException(
          'Either professionId or toolId must be provided.',
        );
      }

      if (dto.professionId && dto.toolId) {
        throw new BadRequestException(
          'Only one of professionId or toolId can be provided.',
        );
      }

      if (dto.professionId) {
        const profession = await this.prisma.profession.findUnique({
          where: { id: dto.professionId },
        });
        if (!profession) {
          throw new BadRequestException('Invalid professionId.');
        }
      }

      if (dto.toolId) {
        const tool = await this.prisma.tool.findUnique({
          where: { id: dto.toolId },
        });
        if (!tool) {
          throw new BadRequestException('Invalid toolId.');
        }
      }

      if (dto.livelId) {
        const level = await this.prisma.level.findUnique({
          where: { id: dto.livelId },
        });
        if (!level) {
          throw new BadRequestException('Invalid livelId.');
        }
      }

      const basket = await this.prisma.basket.create({
        data: {
          userId: userId,
          professionId: dto.professionId,
          toolId: dto.toolId,
          livelId: dto.livelId,
          quantity: dto.quantity,
          timeUnit: dto.timeUnit,
          workingTime: dto.workingTime,
          price: dto.price,
        },
      });

      return { data: basket };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll(req: Request) {
    try {
      let id = req['user'].id;

      let data = await this.prisma.basket.findFirst({
        where: { userId: id },
        include: {
          user: { select: { fullName: true, phone: true, role: true } },
          profession: true,
          tool: true,
          level: true,
        },
      });

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

      if (data.professionId) {
        const profession = await this.prisma.profession.findUnique({
          where: { id: data.professionId },
        });
        if (!profession) {
          throw new BadRequestException('Profession not found');
        }
      }

      if (data.toolId) {
        const tool = await this.prisma.tool.findUnique({
          where: { id: data.toolId },
        });
        if (!tool) {
          throw new BadRequestException('Tool not found');
        }
      }

      if (data.levelId) {
        const level = await this.prisma.level.findUnique({
          where: { id: data.levelId },
        });
        if (!level) {
          throw new BadRequestException('Level not found');
        }
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

  async myBasket(req: Request) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: { id: req['user'].userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'My Basket',
        data: await this.prisma.basket.findMany({
          where: { userId: req['user'].userId },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }
}
