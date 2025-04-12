import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyIformationDto } from './dto/create-company-iformation.dto';
import { UpdateCompanyIformationDto } from './dto/update-company-iformation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyIformationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyIformationDto) {
    let chechCompany = await this.prisma.companyInformation.findFirst({
      where: { INN: data.INN },
    });

    if (chechCompany) {
      throw new BadRequestException('This Company alredy exist!');
    }

    return {
      message: 'Company created Successfully',
      data: await this.prisma.companyInformation.create({ data }),
    };
  }

  findAll() {
    return `This action returns all companyIformation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyIformation`;
  }

  update(id: number, updateCompanyIformationDto: UpdateCompanyIformationDto) {
    return `This action updates a #${id} companyIformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyIformation`;
  }
}
