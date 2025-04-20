import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryLevelDto } from './dto/level-query.dto';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateLevelDto) {
    try {
      let checkLevel = await this.prisma.level.findFirst({
        where: { name_uz: data.name_uz },
      });

      if (checkLevel) {
        throw new BadRequestException('This Level alredy exist');
      }

      return {
        message: 'Level added succuessfully',
        data: await this.prisma.level.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.level.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkLevel = await this.prisma.level.findFirst({
        where: { id },
      });

      if (!checkLevel) {
        throw new BadRequestException('Level Not Found');
      }

      return { data: checkLevel };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateLevelDto) {
    try {
      let checkLevel = await this.prisma.level.findFirst({
        where: { id },
      });

      if (!checkLevel) {
        throw new BadRequestException('Level Not Found');
      }

      if (data.name_en && data.name_ru && data.name_uz) {
        let checkProff = await this.prisma.level.findFirst({
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
        message: 'Level changet successfully',
        data: await this.prisma.level.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checkLevel = await this.prisma.level.findFirst({
        where: { id },
      });

      if (!checkLevel) {
        throw new BadRequestException('Level Not Found');
      }
      return {
        message: 'Level deleted successfully',
        data: await this.prisma.level.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QueryLevelDto, req: Request) {
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

      return this.prisma.level.findMany({
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
