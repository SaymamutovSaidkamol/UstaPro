import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryFaqDto } from './dto/faq-query.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateFaqDto) {
    try {
      return {
        message: 'Faq created successfully',
        data: await this.prisma.fAQ.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.fAQ.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkFaq = await this.prisma.fAQ.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('Faq not found');
      }
      return { data: checkFaq };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateFaqDto) {
    try {
      let checkFaq = await this.prisma.fAQ.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('Faq not found');
      }
      return {
        message: 'FAQ changet successfully',
        data: await this.prisma.fAQ.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checkFaq = await this.prisma.fAQ.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('Faq not found');
      }

      return {
        message: 'FAQ deleted successfully',
        data: await this.prisma.fAQ.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QueryFaqDto, req: Request) {
    try {
      const {
        question_uz,
        question_ru,
        question_en,
        page,
        limit,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = ((page ?? 1) - 1) * parseInt(String(limit ?? 10), 10);
      const take = parseInt(String(limit ?? 10), 10);

      const where: any = {
        ...(question_uz && {
          question_uz: { contains: question_uz, mode: 'insensitive' },
        }),
        ...(question_ru && {
          question_ru: { contains: question_ru, mode: 'insensitive' },
        }),
        ...(question_en && {
          question_en: { contains: question_en, mode: 'insensitive' },
        }),
      };

      return this.prisma.fAQ.findMany({
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
