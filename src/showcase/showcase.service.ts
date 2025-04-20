import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryShowcaseDto } from './dto/showcase-query.dto';

@Injectable()
export class ShowcaseService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
  async create(data: CreateShowcaseDto) {
    try {
      return {
        message: 'Faq created successfully',
        data: await this.prisma.showcase.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.showcase.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkFaq = await this.prisma.fAQ.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('ShowCase not found');
      }

      return { data: checkFaq };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateShowcaseDto) {
    try {
      let checkFaq = await this.prisma.fAQ.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('ShowCase not found');
      }

      if (
        (data.name_uz && data.name_ru && !data.name_en) ||
        (data.name_uz && !data.name_ru && data.name_en) ||
        (!data.name_uz && data.name_ru && data.name_en) ||
        (data.name_uz && !data.name_ru && !data.name_en) ||
        (!data.name_uz && data.name_ru && !data.name_en) ||
        (!data.name_uz && !data.name_ru && data.name_en)
      ) {
        throw new BadRequestException('Error message please try again');
      }

      if (
        (data.description_uz && data.description_ru && !data.description_en) ||
        (data.description_uz && !data.description_ru && data.description_en) ||
        (!data.description_uz && data.description_ru && data.description_en) ||
        (data.description_uz && !data.description_ru && !data.description_en) ||
        (!data.description_uz && data.description_ru && !data.description_en) ||
        (!data.description_uz && !data.description_ru && data.description_en)
      ) {
        throw new BadRequestException('Error message please try again');
      }

      return {
        messafe: 'ShowCase changet successfully!',
        data: await this.prisma.showcase.update({ where: { id }, data }),
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
        messafe: 'ShowCase deleted successfully!',
        data: await this.prisma.showcase.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QueryShowcaseDto, req: Request) {
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

      return this.prisma.showcase.findMany({
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
