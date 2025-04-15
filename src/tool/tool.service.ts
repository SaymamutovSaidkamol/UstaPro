import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryToolDto } from './dto/tool-query.dto';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
  async create(data: CreateToolDto) {
    try {
      if (data.quantity < 0) {
        throw new BadRequestException('The wrong amount was deducted.');
      }

      let checkBrand = await this.prisma.brand.findFirst({
        where: { id: data.brandId },
      });

      if (!checkBrand) {
        throw new NotFoundException('Brand Not Found');
      }

      let checkPower = await this.prisma.power.findFirst({
        where: { id: data.powerId },
      });

      if (!checkPower) {
        throw new NotFoundException('Power Not Found');
      }

      let checkSize = await this.prisma.size.findFirst({
        where: { id: data.sizeId },
      });

      if (!checkSize) {
        throw new NotFoundException('Size Not Found');
      }

      let uniqueCode: string;

      while (true) {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        uniqueCode = `CODE_${randomNumber}`;

        const existing = await this.prisma.tool.findUnique({
          where: { code: uniqueCode },
        });

        if (!existing) break; 
      }

      data.code = uniqueCode;

      const toolData = {
        ...data,
        price: String(data.price),
      };

      return this.prisma.tool.create({ data: toolData });
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return {
        data: await this.prisma.tool.findMany({
          include: { brand: true, power: true, size: true },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkTool = await this.prisma.tool.findFirst({ where: { id } });

      if (!checkTool) {
        throw new NotFoundException('Tool not found');
      }

      return { data: checkTool };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateToolDto) {
    try {
      let checkTool = await this.prisma.tool.findFirst({ where: { id } });

    if (!checkTool) {
      throw new NotFoundException('Tool not found');
    }

    if (data.name_uz || data.name_en || data.name_ru) {
      if (
        (data.name_uz && data.name_ru && !data.name_en) ||
        (data.name_uz && !data.name_ru && data.name_en) ||
        (!data.name_uz && data.name_ru && data.name_en) ||
        (data.name_uz && !data.name_ru && !data.name_en) ||
        (!data.name_uz && data.name_ru && !data.name_en) ||
        (!data.name_uz && !data.name_ru && data.name_en)
      ) {
        throw new BadRequestException('Error message please try again');
      }
    }

    if (data.description_uz || data.description_en || data.description_ru) {
      if (
        (data.description_uz && data.description_ru && !data.description_en) ||
        (data.description_uz && !data.description_ru && data.description_en) ||
        (!data.description_uz && data.description_ru && data.description_en) ||
        (data.description_uz && !data.description_ru && !data.description_en) ||
        (!data.description_uz && data.description_ru && !data.description_en) ||
        (!data.description_uz && !data.description_ru && data.description_en)
      ) {
        throw new BadRequestException('Error message please try again');
      }
    }

    if (data.quantity) {
      if (data.quantity < 0) {
        throw new BadRequestException('The wrong amount was deducted.');
      }
    }

    if (data.brandId) {
      let checkBrand = await this.prisma.brand.findFirst({
        where: { id: data.brandId },
      });

      if (!checkBrand) {
        throw new NotFoundException('Brand Not Found');
      }
    }

    if (data.powerId) {
      let checkPower = await this.prisma.power.findFirst({
        where: { id: data.powerId },
      });

      if (!checkPower) {
        throw new NotFoundException('Power Not Found');
      }
    }

    if (data.sizeId) {
      let checkSize = await this.prisma.size.findFirst({
        where: { id: data.sizeId },
      });

      if (!checkSize) {
        throw new NotFoundException('Size Not Found');
      }
    }

    let toolData = { ...data };

    if (data.price) {
      toolData.price = String(data.price);
    }

    return {
      message: 'Tool changed successfully',
      data: await this.prisma.tool.update({
        where: { id },
        data: toolData,
      }),
    };
    } catch (error) {
      this.Error(error)
    }
  }

  async remove(id: number) {
    try {
      let checkTool = await this.prisma.tool.findFirst({ where: { id } });

      if (!checkTool) {
        throw new NotFoundException('Tool not found');
      }

      return {
        message: 'Tool Deleted Successfully',
        data: await this.prisma.tool.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

    async query(dto: QueryToolDto, req: Request) {
      try {
        const {
          name_uz,
          name_en,
          name_ru,
          price,
          quantity,
          code,
          brandId,
          powerId,
          sizeId,
          page = 1,
          limit = 10,
          sortBy = 'createdAt',
          order = 'desc',
        } = dto;
  
        const skip = (page - 1) * limit;
  
        return this.prisma.tool.findMany({
          where: {
            name_uz: name_uz
              ? { contains: name_uz, mode: 'insensitive' }
              : undefined,
            name_en: name_en
              ? { contains: name_uz, mode: 'insensitive' }
              : undefined,
            name_ru: name_ru
              ? { contains: name_uz, mode: 'insensitive' }
              : undefined,
            price: String(price),
            quantity: Number(quantity),
            code: String(code),
            brandId: Number(brandId),
            powerId: Number(powerId),
            sizeId: Number(sizeId),
          },
          orderBy: {
            [sortBy]: order,
          },
          skip,
          take: limit,
        });
      } catch (error) {
        this.Error(error);
      }
    }
}
