import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryPartnersDto } from './dto/partners-query.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreatePartnerDto) {
    try {
      return { data: await this.prisma.partners.create({ data }) };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.partners.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkFaq = await this.prisma.partners.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('Partners not found');
      }

      return { data: checkFaq };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdatePartnerDto) {
    try {
      let checkFaq = await this.prisma.partners.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('Partners not found');
      }

      return {
        message: 'Pasrtner changet successfully',
        data: await this.prisma.partners.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checkFaq = await this.prisma.fAQ.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('Partners not found');
      }

      return {
        message: 'Partners deleted successfully',
        data: await this.prisma.partners.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QueryPartnersDto, req: Request) {
    try {
      const {
        name_uz,
        name_ru,
        name_en,
        page,
        limit,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = ((page ?? 1) - 1) * parseInt(String(limit ?? 10), 10);
      const take = parseInt(String(limit ?? 10), 10);

      const where: any = {
        ...(name_uz && { name_uz: { contains: name_uz, mode: 'insensitive' } }),
        ...(name_en && { name_en: { contains: name_en, mode: 'insensitive' } }),
        ...(name_ru && { name_ru: { contains: name_ru, mode: 'insensitive' } }),
      };

      return this.prisma.partners.findMany({
        where,
        orderBy: {
          [sortBy || 'createdAt']: order || 'desc',
        },
        skip,
        take,
      });
    } catch (error) {
      this.Error(error);
    }
  }
}
