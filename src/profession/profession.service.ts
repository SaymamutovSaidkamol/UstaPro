import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProfessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProfessionDto) {
    let checkProff = await this.prisma.profession.findFirst({
      where: { name_uz: data.name_uz },
    });

    if (checkProff) {
      throw new BadRequestException('This Profession alredy exist');
    }

    return {
      message: 'Profession addet successfully',
      data: await this.prisma.profession.create({ data }),
    };
  }

  async findAll() {
    return { data: await this.prisma.profession.findMany() };
  }

  async findOne(id: number) {
    let checkProff = await this.prisma.profession.findFirst({
      where: { id },
    });

    if (!checkProff) {
      throw new NotFoundException('Profession not found');
    }
    return { data: checkProff };
  }

  async update(id: number, data: UpdateProfessionDto) {
    let checkProff = await this.prisma.profession.findFirst({
      where: { id },
    });

    if (!checkProff) {
      throw new NotFoundException('Profession not found');
    }

    if (data.name_en && data.name_ru && data.name_uz) {
      let checkProff = await this.prisma.profession.findFirst({
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
      message: 'Profession changet successfully',
      data: await this.prisma.profession.update({ where: { id }, data }),
    };
  }

  async remove(id: number) {
    let checkProff = await this.prisma.profession.findFirst({
      where: { id },
    });

    if (!checkProff) {
      throw new NotFoundException('Profession not found');
    }
    return {
      message: 'Profession deleted successfully',
      ata: await this.prisma.profession.delete({ where: { id } }),
    };
  }
}
