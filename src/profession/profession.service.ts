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
    let { ProfessionLevel, ProfessionTool, ...body } = data;

    let checkProff = await this.prisma.profession.findFirst({
      where: { name_uz: data.name_uz },
    });

    if (checkProff) {
      throw new BadRequestException('This Profession alredy exist');
    }

    let chechLevel = await this.prisma.level.findFirst({
      where: { id: ProfessionLevel[0].levelId },
    });

    if (!chechLevel) {
      throw new NotFoundException('Level Not Found');
    }

    let chechTool = await this.prisma.tool.findFirst({
      where: { id: ProfessionTool[0].toolId },
    });

    if (!chechTool) {
      throw new NotFoundException('Tool Not Found');
    }

    let newProfession = await this.prisma.profession.create({
      data: { ...body },
    });

    let newProfLevel = await this.prisma.professionLevel.create({
      data: {
        professionId: newProfession.id,
        levelId: ProfessionLevel[0].levelId,
      },
    });

    let newProfTool = await this.prisma.professionTool.create({
      data: {
        professionId: newProfession.id,
        toolId: ProfessionTool[0].toolId,
      },
    });

    return {
      message: 'Profession addet successfully',
      data: newProfession,
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
