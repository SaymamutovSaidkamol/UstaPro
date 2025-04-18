import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateMasterDto,
  isValidUzbekPhoneNumber,
} from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { QueryMasterDto } from './dto/query-master.dto';

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService) {}
  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
  async create(data: CreateMasterDto) {
    try {
      let { MasterProfession, ...body } = data;
      let checkMaster = await this.prisma.master.findFirst({
        where: { phoneNumber: data.phoneNumber },
      });

      if (checkMaster) {
        throw new BadRequestException('This master alredy exist');
      }

      let checkUser = await this.prisma.users.findFirst({
        where: { id: data.userId },
      });

      if (!checkUser) {
        throw new BadRequestException('User Not Found');
      }

      isValidUzbekPhoneNumber(data.phoneNumber);

      if (!isValidUzbekPhoneNumber) {
        throw new BadRequestException('Phone number is invalid');
      }

      let checkProff = await this.prisma.profession.findFirst({
        where: { id: MasterProfession[0].professionId },
      });

      if (!checkProff) {
        throw new NotFoundException('Master profession Profession not found');
      }

      let checkLevel = await this.prisma.level.findFirst({
        where: { id: MasterProfession[0].levelId },
      });

      if (!checkLevel) {
        throw new NotFoundException('Master profession level not found');
      }

      let newMaster = await this.prisma.master.create({ data: { ...body } });

      await this.prisma.masterProfession.create({
        data: {
          professionId: MasterProfession[0].professionId,
          minWorkingHours: MasterProfession[0].minWorkingHours,
          levelId: MasterProfession[0].levelId,
          priceHourly: MasterProfession[0].priceHourly,
          priceDaily: MasterProfession[0].priceDaily,
          experience: MasterProfession[0].experience,
          masterId: newMaster.id,
        },
      });

      return {
        message: 'Master added successfully',
        data: newMaster,
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll() {
    try {
      return {
        data: await this.prisma.master.findMany({
          include: { masterProfession: true },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number) {
    try {
      let checkMaster = await this.prisma.master.findFirst({
        where: { id },
      });

      if (checkMaster) {
        throw new BadRequestException('Master Not Found');
      }

      return { data: checkMaster };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateMasterDto, req: Request) {
    try {
      let checkMaster = await this.prisma.master.findFirst({
        where: { id },
      });

      if (checkMaster) {
        throw new BadRequestException('Master Not Found');
      }

      if (
        req['user'].id != id &&
        req['user'].role != 'ADMIN' &&
        req['user'].role != 'SUPERADMIN'
      ) {
        throw new BadRequestException(
          "Sorry, you are infringing on others' information.",
        );
      }

      if (data.phoneNumber) {
        isValidUzbekPhoneNumber(data.phoneNumber);
      }

      return {
        message: 'Master changet saccessfully',
        data: await this.prisma.master.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      let checkMaster = await this.prisma.master.findFirst({
        where: { id },
      });

      if (checkMaster) {
        throw new BadRequestException('Master Not Found');
      }

      if (req['user'].id != id && req['user'].role != 'ADMIN') {
        throw new BadRequestException(
          "Sorry, you are infringing on others' information.",
        );
      }

      return {
        message: 'Master delete saccessfully',
        data: await this.prisma.master.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async query(dto: QueryMasterDto, req: Request) {
    try {
      const {
        fullName,
        phoneNumber,
        isActive,
        userId,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
      } = dto;

      const skip = (page - 1) * limit;

      // const parsedIsActive = isActive === 'true' ? true : isActive === 'false' ? false : undefined;

      return this.prisma.master.findMany({
        where: {
          fullName: fullName
            ? { contains: fullName, mode: 'insensitive' }
            : undefined,
          phoneNumber: phoneNumber ? { contains: phoneNumber } : undefined,
          isActive: Boolean(isActive),
          // isActive,
          userId: Number(userId),
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
