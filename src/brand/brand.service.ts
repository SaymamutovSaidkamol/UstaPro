import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryBrandDto } from './dto/brand-query.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateBrandDto) {
    try {
      let checkBrand = await this.prisma.brand.findFirst({
        where: { name_uz: data.name_uz },
      });

      if (checkBrand) {
        throw new BadRequestException('This brand alredy exist');
      }

      return {
        message: 'brand added succuessfully',
        data: await this.prisma.brand.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.brand.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkBrand = await this.prisma.brand.findFirst({
        where: { id },
      });

      if (!checkBrand) {
        throw new BadRequestException('brand Not Found');
      }

      return { data: checkBrand };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateBrandDto) {
    try {
      let checkBrand = await this.prisma.brand.findFirst({
        where: { id },
      });

      if (!checkBrand) {
        throw new BadRequestException('brand Not Found');
      }

      if (data.name_en && data.name_ru && data.name_uz) {
        let checkProff = await this.prisma.brand.findFirst({
          where: { name_uz: data.name_uz },
        });

        if (checkProff) {
          throw new BadRequestException('This Profession alredy exist');
        }
      } else if (
        (data.name_uz && data.name_ru && !data.name_en) ||
        (data.name_uz && !data.name_ru && data.name_en) ||
        (!data.name_uz && data.name_ru && data.name_en) ||
        (data.name_uz && !data.name_ru && !data.name_en) ||
        (!data.name_uz && data.name_ru && !data.name_en) ||
        (!data.name_uz && !data.name_ru && data.name_en)
      ) {
        throw new BadRequestException('Error message please try again');
      }

      return {
        message: 'brand changet successfully',
        data: await this.prisma.brand.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checkBrand = await this.prisma.brand.findFirst({
        where: { id },
      });

      if (!checkBrand) {
        throw new BadRequestException('brand Not Found');
      }
      return {
        message: 'brand deleted successfully',
        data: await this.prisma.brand.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QueryBrandDto, req: Request) {
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

      return this.prisma.brand.findMany({
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
