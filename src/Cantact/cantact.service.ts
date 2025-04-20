import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCantactDto } from './dto/update-cantact.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { link } from 'fs';
import { QueryCantactDto } from './dto/cantact-query.dto';
import { CreateCantactDto } from './dto/create-cantact.dto';
import { isValidUzbekPhoneNumber } from 'src/master/dto/create-master.dto';

@Injectable()
export class CantactService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateCantactDto, req: Request) {
    try {
      data.userId = req['user'].userId;

      let checkUser = await this.prisma.users.findFirst({
        where: { id: data.userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      if(!isValidUzbekPhoneNumber(data.phone)){
        throw new BadRequestException("Invalid phone number, example(+998941234567)")
      }

      

      return {
        message: 'New Cantact Added successfully!',
        data: await this.prisma.contact.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll(req: Request) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: { id: req['user'].userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }
      return {
        data: await this.prisma.contact.findMany({
          where: { userId: req['user'].userId },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number, req: Request) {
    try {
      let chekInfo = await this.prisma.contact.findFirst({
        where: { id, userId: req['user'].userId },
      });

      if (!chekInfo) {
        throw new NotFoundException('Cantact not found');
      }

      let checkUser = await this.prisma.users.findFirst({
        where: { id: req['user'].userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      return { data: chekInfo };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateCantactDto, req: Request) {
    try {
      let chekInfo = await this.prisma.contact.findFirst({ where: { id } });

      if (!chekInfo) {
        throw new NotFoundException('Cantact not found');
      }

      if (
        req['user'].userId != chekInfo.userId &&
        req['user'].role != 'ADMIN'
      ) {
        throw new BadRequestException(
          "You cannot change other people's information.",
        );
      }

      return {
        message: 'Cantact Changet successfully',
        data: this.prisma.contact.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      let chekInfo = await this.prisma.contact.findFirst({ where: { id } });

      if (!chekInfo) {
        throw new NotFoundException('Cantact not found');
      }

      if (
        req['user'].userId != chekInfo.userId &&
        req['user'].role != 'ADMIN'
      ) {
        throw new BadRequestException(
          "You cannot change other people's information.",
        );
      }

      return {
        message: 'Cantact deleted successfully',
        data: this.prisma.contact.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QueryCantactDto, req: Request) {
    try {
      const {
        userId,
        full_name,
        phone,
        address,
        message,
        page,
        limit,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = ((page ?? 1) - 1) * parseInt(String(limit ?? 10), 10);
      const take = parseInt(String(limit ?? 10), 10);

      const where: any = {
        ...(userId && { userId: Number(userId) }),
        ...(full_name && { full_name: { contains: full_name, mode: 'insensitive' } }),
        ...(phone && { phone: { contains: phone, mode: 'insensitive' } }),
        ...(address && { address: { contains: address, mode: 'insensitive' } }),
        ...(message && { message: { contains: message, mode: 'insensitive' } }),
      };

      return this.prisma.contact.findMany({
        where,
        orderBy: {
          [sortBy]: order,
        },
        skip,
        take,
      });
    } catch (error) {
      this.Error(error);
    }
  }
}
