import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfessionToolDto } from './dto/create-profession-tool.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessionToolService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
  async create(data: CreateProfessionToolDto) {
    try {
      let checkProf = await this.prisma.profession.findFirst({
        where: { id: data.professionId },
      });

      if (!checkProf) {
        throw new NotFoundException('Profession not found');
      }

      let checkTool = await this.prisma.tool.findFirst({
        where: { id: data.toolId },
      });

      if (!checkTool) {
        throw new NotFoundException('Tool not found');
      }

      return {
        message: 'ProfesseionTool created successfully',
        data: await this.prisma.professionTool.create({ data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return { data: await this.prisma.professionTool.findMany() };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkFaq = await this.prisma.fAQ.findFirst({ where: { id } });

      if (!checkFaq) {
        throw new NotFoundException('ProfessionTool not found');
      }

      return { data: checkFaq };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checkFaq = await this.prisma.professionTool.findFirst({
        where: { id },
      });

      if (!checkFaq) {
        throw new NotFoundException('ProfessionTool not found');
      }
    } catch (error) {
      this.Error(error);
    }
  }
}
