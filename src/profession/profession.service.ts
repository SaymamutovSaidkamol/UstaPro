import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryProfessionDto } from './dto/query-profession.dto';

@Injectable()
export class ProfessionService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateProfessionDto) {
    try {
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
          minWorkingHours: ProfessionLevel[0].minWorkingHours,
          priceHourly: ProfessionLevel[0].priceHourly,
          priceDaily: ProfessionLevel[0].priceDaily,
          createdAt: ProfessionLevel[0].createdAt,
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
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return {
        data: await this.prisma.profession.findMany({
          include: {
            professionLevels: {
              include: {
                level: {
                  select: { name_uz: true, name_ru: true, name_en: true },
                },
              },
            },
            professionTools: {
              include: {
                tool: {
                  select: { name_uz: true, name_ru: true, name_en: true },
                },
              },
            },
            _count: {
              select: { orderProducts: true },
            },
          },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkProff = await this.prisma.profession.findFirst({
        where: { id },
        include: {
          professionLevels: {
            include: {
              level: {
                select: { name_uz: true, name_ru: true, name_en: true },
              },
            },
          },
          professionTools: {
            include: {
              tool: {
                select: { name_uz: true, name_ru: true, name_en: true },
              },
            },
          },
          _count: {
            select: { orderProducts: true },
          },
        },
      });

      if (!checkProff) {
        throw new NotFoundException('Profession not found');
      }
      return { data: checkProff };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateProfessionDto) {
    try {
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
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
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
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QueryProfessionDto, req: Request) {
    try {
      const {
        name_uz,
        name_ru,
        name_en,
        minWorkingHours,
        priceHourly,
        priceDaily,
        page,
        limit,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = ((page ?? 1) - 1) * parseInt(String(limit ?? 10), 10);
      const take = parseInt(String(limit ?? 10), 10);

      const where: any = {
        ...(name_uz && { name_uz: { contains: name_uz, mode: 'insensitive' } }),
        ...(name_ru && { name_ru: { contains: name_ru, mode: 'insensitive' } }),
        ...(name_en && { name_en: { contains: name_en, mode: 'insensitive' } }),
        ...(minWorkingHours && {
          minWorkingHours: { contains: minWorkingHours, mode: 'insensitive' },
        }),
        ...(priceHourly && {
          priceHourly: { contains: priceHourly, mode: 'insensitive' },
        }),
        ...(priceDaily && {
          priceDaily: { contains: priceDaily, mode: 'insensitive' },
        }),
        ...(name_ru && { name_ru: { contains: name_ru, mode: 'insensitive' } }),
      };

      return this.prisma.profession.findMany({
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
