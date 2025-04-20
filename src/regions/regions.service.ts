import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryUserDto } from 'src/users/dto/user-query.dto';
import { QueryRegionDto } from './dto/region-query.dto';
import { QueryBrandDto } from 'src/brand/dto/brand-query.dto';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateRegionDto) {
    try {
      let checkRegion = await this.prisma.regions.findFirst({
        where: { name_uz: data.name_uz },
      });

      if (checkRegion) {
        throw new BadRequestException('This region alredy exist');
      }

      let newRegion = await this.prisma.regions.create({ data });

      return { message: 'new region successfully added', data: newRegion };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.regions.findMany();
    } catch (error) {}
  }

  async findOne(id: number) {
    try {
      let checkRegion = await this.prisma.regions.findFirst({ where: { id } });

      if (!checkRegion) {
        throw new NotFoundException('Region Not Found');
      }

      return { data: checkRegion };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateRegionDto) {
    try {
      let checkRegion1 = await this.prisma.regions.findFirst({ where: { id } });

      if (!checkRegion1) {
        throw new NotFoundException('Region Not Found');
      }

      let checkRegion2 = await this.prisma.regions.findFirst({
        where: { name_uz: data.name_uz },
      });

      if (checkRegion2) {
        throw new BadRequestException('This region alredy exist');
      }

      let newRigion = await this.prisma.regions.update({ where: { id }, data });

      return { message: 'new region successfully changet', data: newRigion };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checkRegion1 = await this.prisma.regions.findFirst({ where: { id } });

      if (!checkRegion1) {
        throw new NotFoundException('Region Not Found');
      }

      return {
        message: 'new region successfully deleted',
        data: await this.prisma.regions.delete({ where: { id } }),
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
        sortBy,
        order,
      } = dto;

      const skip = ((page ?? 1) - 1) * parseInt(String(limit ?? 10), 10);
      const take = parseInt(String(limit ?? 10), 10);

      const where: any = {
        ...(name_uz && { name_uz: { contains: name_uz, mode: 'insensitive' } }),
        ...(name_en && { name_en: { contains: name_en, mode: 'insensitive' } }),
        ...(name_ru && { name_ru: { contains: name_ru, mode: 'insensitive' } }),
      };

      return this.prisma.regions.findMany({
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
