import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateRegionDto) {
    let checkRegion = await this.prisma.regions.findFirst({
      where: { name_uz: data.name_uz },
    });

    if (checkRegion) {
      throw new BadRequestException('This region alredy exist');
    }

    let newRegion = await this.prisma.regions.create({ data });

    return { message: 'new region successfully added', data: newRegion };
  }

  async findAll() {
    return await this.prisma.regions.findMany();
  }

  async findOne(id: number) {
    let checkRegion = await this.prisma.regions.findFirst({ where: { id } });

    if (!checkRegion) {
      throw new NotFoundException('Region Not Found');
    }

    return { data: checkRegion };
  }

  async update(id: number, data: UpdateRegionDto) {
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
  }

  async remove(id: number) {
    let checkRegion1 = await this.prisma.regions.findFirst({ where: { id } });

    if (!checkRegion1) {
      throw new NotFoundException('Region Not Found');
    }

    return {
      message: 'new region successfully deleted',
      data: await this.prisma.regions.delete({ where: { id } }),
    };
  }
}
