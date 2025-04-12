import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto, LoginDto, VerifyDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { MailService } from 'src/mail/mail.service';
import { totp } from 'otplib';
import { UpdateUserDto } from './dto/update-user.dto';
import { EskizService } from 'src/eskiz/eskiz.service';

totp.options = { step: 120 };

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailer: MailService,
    private eskiz: EskizService,
  ) {}

  async register(data: RegisterDto) {
    let checkUser = await this.prisma.users.findFirst({
      where: { phone: data.phone },
    });

    if (checkUser) {
      let otp = totp.generate('secret' + data.phone);

      let sendOtp = await this.mailer.sendMail(
        data.email,
        'New Otp',
        `new Otp:  ${otp}`,
      );
      return {
        message: 'Your verification code Please verify your account.',
        otp,
      };
    }

    let checkRegion = await this.prisma.regions.findFirst({
      where: { id: data.regionId },
    });

    if (!checkRegion) {
      throw new NotFoundException('Region Not Found');
    }

    if (data.role == 'USER_FIZ') {
      if (!data.companyId) {
        throw new BadRequestException('Company ID is required.');
      }

      let checkCompany = await this.prisma.companyInformation.findFirst({
        where: { id: data.companyId },
      });

      if (!checkCompany) {
        throw new NotFoundException('Company Not Found');
      }
    } else {
      if (data.companyId) {
        throw new BadRequestException('Error message was sent.');
      }
    }

    let hashPassword = bcrypt.hashSync(data.password, 7);
    data.password = hashPassword;

    let otp = totp.generate('secret' + data.phone);

    let sendOtp = await this.mailer.sendMail(
      data.email,
      'New Otp',
      `new Otp:  ${otp}`,
    );
    // await this.eskiz.sendSMS('Send SMS', data.phone);    Eskizdan SMS jo'natish

    let newUser = await this.prisma.users.create({ data });

    return {
      message: 'Registration created successfully. Please verify your account.',
      Code: otp,
    };
  }

  async verify(data: VerifyDto) {
    let checkUser = await this.prisma.users.findFirst({
      where: { phone: data.phone },
    });

    if (!checkUser) {
      throw new NotFoundException('User Not Found');
    }

    let secret = 'secret' + data.phone;
    let verifyOtp = totp.verify({ token: data.otp, secret });

    if (!verifyOtp) {
      throw new BadRequestException('Invalid Otp');
    }

    let UpdateUser = await this.prisma.users.update({
      where: { phone: data.phone },
      data: { status: 'ACTIVE' },
    });

    return { message: 'Your account has been activated.' };
  }

  async login(data: LoginDto) {
    let checkUser = await this.prisma.users.findFirst({
      where: { phone: data.phone },
    });

    if (!checkUser) {
      throw new NotFoundException('User Not Found');
    }

    if (checkUser.status != 'ACTIVE') {
      throw new BadRequestException('Please activate your account.');
    }

    
    return { data: checkUser };
  }

  async findAll() {
    return {
      data: await this.prisma.users.findMany({
        include: { company: true, region: true },
      }),
    };
  }
}
