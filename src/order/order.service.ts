import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
  async create(data: CreateOrderDto, req: Request) {
    try {
      data.userId = req['user'].id;
      // data.userId = 1;

      let checkUser = await this.prisma.users.findFirst({
        where: { id: data.userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found or token invalid');
      }

      if (data.withDelivery) {
        if (!data.message) {
          throw new BadRequestException('Please enter a message');
        }
      } else if (!data.withDelivery) {
        if (data.message) {
          throw new BadRequestException(
            'You can only write a message if you choose a delivery service.',
          );
        }
      }

      return {
        message: 'Order created successfully',
        data: await this.prisma.order.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll(req: Request) {
    try {
      let id = req['user'].id;

      let checkUser = await this.prisma.users.findFirst({
        where: { id },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found or token invalid');
      }

      return {
        data: await this.prisma.order.findMany({
          where: { userId: id },
          include: {
            user: { select: { fullName: true, phone: true, role: true } },
            orderTool: true,
            orderProduct: true,
            comment: true,
          },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number, req: Request) {
    try {
      let checkFaq = await this.prisma.order.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('Order not found');
      }

      let UserId = req['user'].id;

      let checkUser = await this.prisma.users.findFirst({
        where: { id: UserId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found or token invalid');
      }

      return {
        data: await this.prisma.order.findFirst({
          where: { id, userId: UserId },
          include: {
            user: { select: { fullName: true, phone: true, role: true } },
            orderTool: true,
            orderProduct: true,
            comment: true,
          },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      let checkFaq = await this.prisma.fAQ.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('Order not found');
      }

      let userCeck = await this.prisma.users.findFirst({
        where: { id: req['user'].id },
      });

      if (!userCeck) {
        throw new NotFoundException('User not found');
      }

      if (req['user'].id != id && req['user'].role != 'ADMIN') {
        throw new BadRequestException(
          "Sorry, you can't send other people's information.",
        );
      }

      return {
        message: 'Order deleted successfully',
        data: await this.prisma.order.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }
}
