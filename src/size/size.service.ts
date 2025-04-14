import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
