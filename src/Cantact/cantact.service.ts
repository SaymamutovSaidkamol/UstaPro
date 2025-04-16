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
      data.userId = req['user'].id;

      let checkUser = await this.prisma.users.findFirst({
        where: { id: data.userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      return {
        message: 'New Cantact Added successfully!',
        data: await this.prisma.contact.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.contact.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let chekInfo = await this.prisma.contact.findFirst({ where: { id } });

      if (!chekInfo) {
        throw new NotFoundException('Cantact not found');
      }

      return { data: chekInfo };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateCantactDto) {
    try {
      let chekInfo = await this.prisma.contact.findFirst({ where: { id } });

      if (!chekInfo) {
        throw new NotFoundException('Cantact not found');
      }

      return {
        message: 'Cantact Changet successfully',
        data: this.prisma.contact.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let chekInfo = await this.prisma.contact.findFirst({ where: { id } });

      if (!chekInfo) {
        throw new NotFoundException('Cantact not found');
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
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = (page - 1) * limit;

      return this.prisma.contact.findMany({
        where: {
          userId: Number(userId),
          full_name: full_name
            ? { contains: full_name, mode: 'insensitive' }
            : undefined,
          address: address
            ? { contains: address, mode: 'insensitive' }
            : undefined,
        },
        orderBy: {
          [sortBy]: order,
        },
        skip,
        take: limit,
      });
    } catch (error) {
      this.Error(error);
    }
  }
}
