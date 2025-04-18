import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  RegisterDto,
  LoginDto,
  VerifyDto,
  sendOtpDto,
  resetPasswordDto,
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

  async register(data: RegisterDto) {
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

    if (data.role == 'USER_YUR') {
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

    // let sendOtp = await this.mailer.sendMail(
    //   data.email,
    //   'New Otp',
    //   `new Otp:  ${otp}`,
    // );

    // await this.eskiz.sendSMS('Send SMS', data.phone);
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
    console.log(verifyOtp);

    if (!verifyOtp) {
      throw new BadRequestException('Invalid Otp');
    }

    let UpdateUser = await this.prisma.users.update({
      where: { phone: data.phone },
      data: { status: 'ACTIVE' },
    });

    return { message: 'Your account has been activated.' };
  }

  async login(data: LoginDto, req: Request) {
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
    return {
      data: await this.prisma.users.findMany({
        include: { company: true, region: true },
      }),
    };
  }

  async remove(id: number, req: Request) {
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
  }

  async sendotpPassword(data: sendOtpDto, req: Request) {
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

    // let sendOtp = await this.mailer.sendMail(
    //   checkUser.email,
    //   'New Otp',
    //   `new Otp:  ${otp}`,
    // );

    // await this.eskiz.sendSMS('Send SMS', data.phone);    Eskizdan SMS jo'natish

    return { otp };
  }

  async resetPassword(data: resetPasswordDto) {
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
  }

  async sendOtp(phone: sendOtpDto) {
    let checkUser = await this.prisma.users.findFirst({
      where: { phone: phone.phone },
    });

    if (!checkUser) {
      throw new BadRequestException('User Not Found');
    }

    // await this.eskiz.sendSMS('Send SMS', data.phone);    Eskizdan SMS jo'natish

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
  }

  async UpdateForAdmin(id: number, data: UpdateUserForAdminDto) {
    let checkUser = await this.prisma.users.findFirst({ where: { id } });

    if (!checkUser) {
      throw new NotFoundException('User Not Found');
    }

    return {
      message: 'User updated successfully',
      data: await this.prisma.users.update({ where: { id }, data }),
    };
  }

  async UpdateForUser(id: number, data: UpdateUserForUserDto, req: Request) {
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
  }

  async getSessions(req: Request) {
    let user = req['user'];
    try {
      let data = await this.prisma.session.findFirst({
        where: { userId: user?.id },
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
    return {
      message: 'Active User',
      data: await this.prisma.users.findFirst({ where: { status: 'ACTIVE' } }),
    };
  }

  async InActiveUser() {
    return {
      message: 'InActive User',
      data: await this.prisma.users.findFirst({
        where: { status: 'INACTIVE' },
      }),
    };
  }

  async GetMe(req: Request) {
    let id = req['user'].id;
    return {
      message: 'My Information',
      data: await this.prisma.users.findFirst({ where: { id } }),
    };
  }

  async addAdmin(data: RegisterDto, req: Request) {
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

      // await this.eskiz.sendSMS('Send SMS', data.phone);
      let newUser = await this.prisma.users.create({ data });

      return {
        message:
          'Admin added successfully',
        Code: otp,
      };
    } catch (error) {}
  }
}
