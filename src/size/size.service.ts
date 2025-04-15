import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuerySizeDto } from './dto/size-query.dto';

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateSizeDto) {
    try {
      let checksize = await this.prisma.size.findFirst({
        where: { name_uz: data.name_uz },
      });

      if (checksize) {
        throw new BadRequestException('This size alredy exist');
      }

      return {
        message: 'size added succuessfully',
        data: await this.prisma.size.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.size.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checksize = await this.prisma.size.findFirst({
        where: { id },
      });

      if (!checksize) {
        throw new BadRequestException('size Not Found');
      }

      return { data: checksize };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateSizeDto) {
    try {
      let checksize = await this.prisma.size.findFirst({
        where: { id },
      });

      if (!checksize) {
        throw new BadRequestException('size Not Found');
      }

      if (data.name_en && data.name_ru && data.name_uz) {
        let checkProff = await this.prisma.size.findFirst({
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
        message: 'size changet successfully',
        data: await this.prisma.size.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checksize = await this.prisma.size.findFirst({
        where: { id },
      });

      if (!checksize) {
        throw new BadRequestException('size Not Found');
      }
      return {
        message: 'size deleted successfully',
        data: await this.prisma.size.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QuerySizeDto, req: Request) {
    try {
      const {
        name_uz,
        name_ru,
        name_en,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = (page - 1) * limit;

      return this.prisma.brand.findMany({
        where: {
          name_uz: name_uz
            ? { contains: name_uz, mode: 'insensitive' }
            : undefined,
          name_ru: name_ru
            ? { contains: name_uz, mode: 'insensitive' }
            : undefined,
          name_en: name_en
            ? { contains: name_uz, mode: 'insensitive' }
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
