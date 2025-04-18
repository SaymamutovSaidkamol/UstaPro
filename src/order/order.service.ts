import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { UpdateOrderDto } from './dto/update-order.dto';

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
      const { orderProducts, ...body } = data;

      if (!orderProducts?.length) {
        throw new BadRequestException(
          'Order must include at least one product.',
        );
      }

      for (const product of orderProducts) {
        if (product.professionId && product.toolId) {
          throw new BadRequestException(
            'Only one of professionId or toolId can be provided per order product.',
          );
        }
        if (!product.professionId && !product.toolId) {
          throw new BadRequestException(
            'Either professionId or toolId must be provided for each order product.',
          );
        }
      }

      const professionIds = orderProducts
        .filter((op) => op.professionId !== undefined)
        .map((op) => op.professionId)
        .filter((id) => id !== undefined);

      const toolIds = orderProducts
        .filter((op) => op.toolId !== undefined)
        .map((op) => op.toolId)
        .filter((id) => id !== undefined);

      let levelIds = orderProducts
        .filter((op) => op.levelId !== undefined)
        .map((op) => op.levelId)
        .filter((id) => id !== undefined);

      let quantity = orderProducts
        .filter((op) => op.quantity !== undefined)
        .map((op) => op.quantity)
        .filter((id) => id !== undefined);

      levelIds = Array.from(new Set(levelIds));

      const validProfessions = await this.prisma.profession.findMany({
        where: { id: { in: professionIds } },
      });
      if (validProfessions.length !== professionIds.length) {
        throw new BadRequestException(
          'One or more profession IDs are invalid.',
        );
      }

      const validTools = await this.prisma.tool.findMany({
        where: { id: { in: toolIds } },
      });
      if (validTools.length !== toolIds.length) {
        throw new BadRequestException('Tool not found.');
      }

      const validLevels = await this.prisma.level.findMany({
        where: { id: { in: levelIds } },
      });
      if (validLevels.length !== levelIds.length) {
        throw new BadRequestException('Level Not Found');
      }

      const order = await this.prisma.order.create({
        data: {
          ...body,
          userId: req['user'].userId,
        },
      });
      for (const op of orderProducts) {
        if (op.toolId) {
          const tool = await this.prisma.tool.findFirst({
            where: { id: op.toolId },
          });

          if (!tool) {
            throw new BadRequestException(
              `Tool with ID ${op.toolId} not found`,
            );
          }

          if (tool.quantity < op.quantity) {
            throw new BadRequestException(
              `Tool with ID ${op.toolId} has insufficient quantity`,
            );
          }

          await this.prisma.tool.update({
            where: { id: op.toolId },
            data: {
              quantity: tool.quantity - op.quantity,
            },
          });
        }
      }

      const orderProductData = orderProducts.map((product) => ({
        orderId: order.id,
        professionId: product.professionId,
        toolId: product.toolId,
        levelId: product.levelId,
        quantity: product.quantity,
        timeUnit: product.timeUnit,
        workingTime: product.workingTime,
        price: product.price,
      }));

      await this.prisma.orderProduct.createMany({ data: orderProductData });

      return { message: 'Order created successfully!', data: order };
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

  async update(id: number, data: UpdateOrderDto, req: Request) {
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
      let checkMaster = await this.prisma.master.findFirst({
        where: { id: data.masterId },
      });

      if (!checkMaster) {
        throw new NotFoundException('Master not found ');
      }

      await this.prisma.masterProduct.create({
        data: { orderId: id, masterId: data.masterId! },
      });

      return {
        message: 'Order changet succesfully',
        data: await this.prisma.order.update({
          where: { id },
          data: { status: 'ACCEPTED' },
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
