import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateCommentDto, req: Request) {
    try {
      data.userId = req['user'].userId;

      let checkUser = await this.prisma.users.findFirst({
        where: { id: data.userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found or token invalid');
      }

      let checkOrder = await this.prisma.order.findFirst({
        where: { id: data.orderId },
      });

      if (!checkOrder) {
        throw new NotFoundException('Order not found');
      }

      // ------------------------------------------------------------
      // Master raiting
      let { masterRatings, ...body } = data;

      let checkMaster = await this.prisma.master.findFirst({
        where: { id: masterRatings[0].masterId },
      });

      if (!checkMaster) {
        throw new NotFoundException('Master not found');
      }

      let newComment = await this.prisma.comment.create({
        data: {
          userId: data.userId,
          message: data.message,
          orderId: data.orderId,
        },
      });

      const masterRatingData = data.masterRatings.map((rating) => ({
        star: rating.star,
        masterId: rating.masterId,
        commentId: newComment.id,
      }));
      await this.prisma.masterReiting.createMany({ data: masterRatingData });

      return {
        data: newComment,
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll(req: Request) {
    try {
      return {
        data: await this.prisma.comment.findMany({
          where: { userId: req['user'].userId },
          include: {
            users: { select: { fullName: true, phone: true, role: true } },
            order: true,
          },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number, req: Request) {
    try {
      let checkComment = await this.prisma.comment.findFirst({ where: { id } });

      if (!checkComment) {
        throw new NotFoundException('Comment not found');
      }

      return {
        data: await this.prisma.comment.findFirst({
          where: { id, userId: req['user'].userId },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, dto: UpdateCommentDto, req: Request) {
    try {
      let checkComment = await this.prisma.comment.findFirst({ where: { id } });

      if (!checkComment) {
        throw new NotFoundException('Comment not found');
      }

      if (dto.masterRatings?.length) {
        // const masterIds = dto.masterRatings?.map(rating => rating.masterId);
        // const masterIds = dto.masterRatings?.filter(Boolean).map(rating => rating.masterId);

        const masterIds = dto.masterRatings
          ?.filter(Boolean)
          .map((rating) => rating.masterId)
          .filter((id) => id !== undefined);
        const validMasters = await this.prisma.master.findMany({
          where: { id: { in: masterIds } },
        });

        if (validMasters.length !== masterIds.length) {
          throw new BadRequestException('One or more master IDs are invalid.');
        }

        const masterRatingData = dto.masterRatings.map((rating) => ({
          id: rating.masterId,
          star: rating.star,
        }));

        await Promise.all(
          masterRatingData.map(async (rating) => {
            await this.prisma.masterReiting.update({
              where: { id: rating.id },
              data: { star: rating.star },
            });
          }),
        );
      }

      const updated = await this.prisma.comment.update({
        where: { id },
        data: { message: dto.message },
      });

      return { data: updated };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      let checkComment = await this.prisma.comment.findFirst({ where: { id } });

      if (!checkComment) {
        throw new NotFoundException('Comment not found');
      }

      if (
        checkComment.userId != req['user'].userId &&
        req['user'].role != 'ADMIN'
      ) {
        throw new BadRequestException(
          "You cannot change other people's information.",
        );
      }

      return {
        message: 'Comment deleted successfully',
        data: await this.prisma.comment.delete({
          where: { id, userId: req['user'].userId },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }
}
