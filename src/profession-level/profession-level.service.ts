import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfessionLevelDto } from './dto/create-profession-level.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessionLevelService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateProfessionLevelDto) {
    try {
      let checkProf = await this.prisma.profession.findFirst({
        where: { id: data.professionId },
      });

      if (!checkProf) {
        throw new NotFoundException('Profession not found');
      }

      let checkTool = await this.prisma.level.findFirst({
        where: { id: data.levelId },
      });

      if (!checkTool) {
        throw new NotFoundException('Level not found');
      }

      return {
        message: 'ProfessionLevel created successfully',
        data: await this.prisma.professionLevel.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.professionLevel.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkFaq = await this.prisma.professionLevel.findFirst({
        where: { id },
      });

      if (!checkFaq) {
        throw new NotFoundException('ProfessionLeavel not found');
      }

      return { data: checkFaq };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checkFaq = await this.prisma.professionLevel.findFirst({
        where: { id },
      });

      if (!checkFaq) {
        throw new NotFoundException('ProfessionLeavel not found');
      }

      return {
        data: await this.prisma.professionLevel.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }
}
