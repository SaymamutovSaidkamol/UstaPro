import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInfoDto } from './dto/create-info.dto';
import { UpdateInfoDto } from './dto/update-info.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryInfoDto } from './dto/info-query.dto';
import { link } from 'fs';

@Injectable()
export class InfoService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateInfoDto) {
    try {
      return {
        message: 'New Info Added successfully!',
        data: await this.prisma.info.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.info.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let chekInfo = await this.prisma.info.findFirst({ where: { id } });

      if (!chekInfo) {
        throw new NotFoundException('Info not found');
      }

      return { data: chekInfo };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateInfoDto) {
    try {
      let chekInfo = await this.prisma.info.findFirst({ where: { id } });

      if (!chekInfo) {
        throw new NotFoundException('Info not found');
      }

      return {
        message: 'Info Changet successfully',
        data: this.prisma.info.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let chekInfo = await this.prisma.info.findFirst({ where: { id } });

      if (!chekInfo) {
        throw new NotFoundException('Info not found');
      }

      return {
        message: 'Info deleted successfully',
        data: this.prisma.info.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QueryInfoDto, req: Request) {
    try {
      const {
        email,
        links,
        phone,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = (page - 1) * limit;

      return this.prisma.brand.findMany({
        where: {
          name_uz: email ? { contains: email, mode: 'insensitive' } : undefined,
          name_ru: links ? { contains: links, mode: 'insensitive' } : undefined,
          name_en: phone ? { contains: phone, mode: 'insensitive' } : undefined,
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
