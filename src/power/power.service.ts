import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreatePowerDto } from './dto/create-power.dto';
import { UpdatePowerDto } from './dto/update-power.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PowerService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreatePowerDto) {
    try {
      let checkpower = await this.prisma.power.findFirst({
        where: { name_uz: data.name_uz },
      });

      if (checkpower) {
        throw new BadRequestException('This power alredy exist');
      }

      return {
        message: 'power added succuessfully',
        data: await this.prisma.power.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.power.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkpower = await this.prisma.power.findFirst({
        where: { id },
      });

      if (!checkpower) {
        throw new BadRequestException('power Not Found');
      }

      return { data: checkpower };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdatePowerDto) {
    try {
      let checkpower = await this.prisma.power.findFirst({
        where: { id },
      });

      if (!checkpower) {
        throw new BadRequestException('power Not Found');
      }

      if (data.name_en && data.name_ru && data.name_uz) {
        let checkProff = await this.prisma.power.findFirst({
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
        message: 'power changet successfully',
        data: await this.prisma.power.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checkpower = await this.prisma.power.findFirst({
        where: { id },
      });

      if (!checkpower) {
        throw new BadRequestException('power Not Found');
      }
      return {
        message: 'power deleted successfully',
        data: await this.prisma.power.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }
}
