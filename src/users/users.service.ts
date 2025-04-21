import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  RegisterDto,
  LoginDto,
  VerifyDto,
  sendOtpDto,
  resetPasswordDto,
  AddAdminDto,
} from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { MailService } from 'src/mail/mail.service';
import { totp } from 'otplib';
import {
  UpdateUserForAdminDto,
  UpdateUserForUserDto,
} from './dto/update-user.dto';
import { EskizService } from 'src/eskiz/eskiz.service';
import * as DeviceDetector from 'device-detector-js';
import { QueryUserDto } from './dto/user-query.dto';
import { isValidUzbekPhoneNumber } from 'src/master/dto/create-master.dto';
import { config } from 'dotenv';

config();

let otp_secret = process.env.SECRET_OTP;

totp.options = { step: 120 };

@Injectable()
export class UsersService {
  private readonly deviceDetector = new DeviceDetector();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailer: MailService,
    private eskiz: EskizService,
  ) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async register(data: RegisterDto) {
    try {
      let { UserCompany, ...body } = data;
      let checkUser = await this.prisma.users.findFirst({
        where: { phone: data.phone },
      });

      if (checkUser) {
        throw new BadRequestException('This User alredy exist');
      }

      let checkRegion = await this.prisma.regions.findFirst({
        where: { id: data.regionId },
      });

      if (!checkRegion) {
        throw new NotFoundException('Region Not Found');
      }

      if (data.role === 'ADMIN') {
        throw new BadRequestException(
          "You can't become an admin, you can't pass.",
        );
      }

      if (!isValidUzbekPhoneNumber(data.phone)) {
        throw new BadRequestException(
          'You entered the wrong number, please try again. example(+998901234567)',
        );
      }

      let hashPassword = bcrypt.hashSync(data.password, 7);
      body.password = hashPassword;

      let otp = totp.generate('secret' + data.phone);
      console.log(data.phone);

      let sendOtp = await this.mailer.sendMail(
        data.email,
        'New Otp',
        `new Otp:  ${otp}`,
      );

      await this.eskiz.sendSMS('Send SMS', data.phone);
      let newUser = await this.prisma.users.create({ data: { ...body } });

      if (data.role === 'USER_YUR') {
        if (!data.UserCompany) {
          throw new BadRequestException(
            'Please also include your company information.',
          );
        }

        await this.prisma.companyInformation.create({
          data: {
            userId: newUser.id,
            INN: UserCompany[0].INN,
            MFO: UserCompany[0].MFO,
            R_S: UserCompany[0].R_S,
            BANK: UserCompany[0].BANK,
            OKEYD: UserCompany[0].OKEYD,
            ADRESS: UserCompany[0].ADRESS,
          },
        });
      }

      return {
        message:
          'Registration created successfully. Please verify your account.',
        Code: otp,
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async verify(data: VerifyDto) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: { phone: data.phone },
      });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      let secret = 'secret' + data.phone;

      let verifyOtp = totp.verify({ token: data.otp, secret });
      console.log(verifyOtp);

      if (!verifyOtp) {
        throw new BadRequestException('Invalid Otp');
      }

      let UpdateUser = await this.prisma.users.update({
        where: { phone: data.phone },
        data: { status: 'ACTIVE' },
      });

      return { message: 'Your account has been activated.' };
    } catch (error) {
      this.Error(error);
    }
  }

  async login(data: LoginDto, req: Request) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: { phone: data.phone },
      });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      if (checkUser.status != 'ACTIVE') {
        throw new BadRequestException('Please activate your account.');
      }

      let checkPassword = bcrypt.compareSync(data.password, checkUser.password);

      if (!checkPassword) {
        throw new BadRequestException('Wrong password');
      }

      let session = await this.prisma.session.findFirst({
        where: { AND: [{ IpAdress: req.ip }, { userId: checkUser.id }] },
      });

      if (!session) {
        let useragent: any = req.headers['user-agent'];
        let device = this.deviceDetector.parse(useragent);

        let sessionData: any = {
          userId: checkUser.id,
          IpAdress: req.ip,
          info: device,
        };

        let newSession = await this.prisma.session.create({
          data: sessionData,
        });
      }

      let accesToken = this.genAccessToken({
        userId: checkUser.id,
        role: checkUser.role,
      });
      let refreshToken = this.genRefreshToken({
        userId: checkUser.id,
        role: checkUser.role,
      });

      return { access_token: accesToken, refresh_token: refreshToken };
    } catch (error) {
      this.Error(error);
    }
  }

  genRefreshToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: 'refresh_secrest',
      expiresIn: '7d',
    });
  }

  genAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: 'access_secret',
      expiresIn: '12h',
    });
  }

  async findAll() {
    try {
      return {
        data: await this.prisma.users.findMany({
          include: { company: true, region: true },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      let checkUser = await this.prisma.users.findFirst({ where: { id } });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      if (req['user'].userId != id && req['user'].role != 'ADMIN') {
        throw new BadRequestException(
          "Sorry, you can't send other people's information.",
        );
      }

      return {
        message: 'Account successfully deleted.',
        data: await this.prisma.users.delete({ where: { id } }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async sendotpPassword(data: sendOtpDto, req: Request) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: { phone: data.phone },
      });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      if (req['user'].userId != checkUser.id) {
        throw new BadRequestException(
          "Sorry, you can't send other people's information.",
        );
      }

      if (checkUser.status != 'ACTIVE') {
        throw new BadRequestException('Please Verify your account');
      }

      let otp = totp.generate('secret-password' + data.phone);

      let sendOtp = await this.mailer.sendMail(
        checkUser.email,
        'New Otp',
        `new Otp:  ${otp}`,
      );

      await this.eskiz.sendSMS('Send SMS', data.phone);    

      return { otp };
    } catch (error) {
      this.Error(error);
    }
  }

  async resetPassword(data: resetPasswordDto) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: { phone: data.phone },
      });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      let secret = 'secret-password' + data.phone;
      let verifyOtp = totp.verify({ token: data.otp, secret });

      if (!verifyOtp) {
        throw new BadRequestException('Invalid Otp');
      }

      let newPassHash = bcrypt.hashSync(data.password, 7);

      data.password = newPassHash;

      return {
        message: 'Password Updated Successfully',
        data: await this.prisma.users.update({
          where: { phone: data.phone },
          data: { password: data.password },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async sendOtp(phone: sendOtpDto) {
    try {
      let checkUser = await this.prisma.users.findFirst({
        where: { phone: phone.phone },
      });

      if (!checkUser) {
        throw new BadRequestException('User Not Found');
      }

      await this.eskiz.sendSMS('Send SMS', phone.phone);

      let otp = totp.generate('secret' + phone.phone);

      // let sendOtp = await this.mailer.sendMail(
      //   data.email,
      //   'New Otp',
      //   `new Otp:  ${otp}`,
      // );
      // return {
      //   message: 'Your verification code Please verify your account.',
      //   otp,
      // };

      return { message: 'OTP sent, please activate your account', otp };
    } catch (error) {
      this.Error(error);
    }
  }

  async UpdateForAdmin(id: number, data: UpdateUserForAdminDto) {
    try {
      let checkUser = await this.prisma.users.findFirst({ where: { id } });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      return {
        message: 'User updated successfully',
        data: await this.prisma.users.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async UpdateForUser(id: number, data: UpdateUserForUserDto, req: Request) {
    try {
      let checkUser = await this.prisma.users.findFirst({ where: { id } });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      if (req['user'].userId != checkUser.id) {
        throw new BadRequestException(
          "Sorry, you can't send other people's information.",
        );
      }

      return {
        message: 'Updated successfully',
        data: await this.prisma.users.update({ where: { id }, data }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async getSessions(req: Request) {
    try {
      let user = req['user'].userId;
      let data = await this.prisma.session.findFirst({
        where: { userId: user },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async delSession(id: number, req: Request) {
    try {
      let checkSession = await this.prisma.session.findFirst({ where: { id } });

      if (!checkSession) {
        throw new NotFoundException('Session Not Found');
      }

      if (req['user'].userId != checkSession.userId) {
        throw new BadRequestException(
          "Sorry, you can't send other people's information.",
        );
      }

      let data = await this.prisma.session.delete({ where: { id } });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async ActiveUser() {
    try {
      return {
        message: 'Active User',
        data: await this.prisma.users.findMany({
          where: { status: 'ACTIVE' },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async InActiveUser() {
    try {
      return {
        message: 'InActive User',
        data: await this.prisma.users.findFirst({
          where: { status: 'INACTIVE' },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async GetMe(req: Request) {
    try {
      let id = req['user'].userId;
      console.log(req['user']);
      
      return {
        message: 'My Information',
        data: await this.prisma.users.findFirst({
          where: { id },
          include: {
            order: true,
            master: true,
            basket: true,
            comment: true,
            region: true,
            cantact: true,
            company: true,
            session: true,
          },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async addAdmin(data: AddAdminDto, req: Request) {
    try {
      if (req['user'].role != 'ADMIN') {
        throw new BadRequestException(
          "You can't become an admin, you can't pass",
        );
      }

      let checkUser = await this.prisma.users.findFirst({
        where: { phone: data.phone },
      });

      if (checkUser) {
        throw new BadRequestException('This User alredy exist');
      }

      let checkRegion = await this.prisma.regions.findFirst({
        where: { id: data.regionId },
      });

      if (!checkRegion) {
        throw new NotFoundException('Region Not Found');
      }

      if (
        data.role != 'ADMIN' &&
        data.role != 'SUPER_ADMIN' &&
        data.role != 'VIEWER_ADMIN'
      ) {
        throw new BadRequestException('You cannot add other roles.');
      }

      let hashPassword = bcrypt.hashSync(data.password, 7);
      data.password = hashPassword;

      let otp = totp.generate('secret' + data.phone);

      // let sendOtp = await this.mailer.sendMail(
      //   data.email,
      //   'New Otp',
      //   `new Otp:  ${otp}`,
      // );

      await this.eskiz.sendSMS('Send SMS', data.phone);
      let newUser = await this.prisma.users.create({ data });

      return {
        message: 'Admin added successfully',
        Code: otp,
      };
    } catch (error) {}
  }

  async query(dto: QueryUserDto, req: Request) {
    try {
      const { fullName, phone, regionId, page, limit, sortBy, order } = dto;

      const skip = ((page ?? 1) - 1) * parseInt(String(limit ?? 10), 10); 
      const take = parseInt(String(limit ?? 10), 10); 

      const where: any = {
        ...(fullName && {
          fullName: { contains: fullName, mode: 'insensitive' },
        }),
        ...(phone && { phone: { contains: phone, mode: 'insensitive' } }),
        ...(regionId && { regionId }),
      };

      return this.prisma.users.findMany({
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
