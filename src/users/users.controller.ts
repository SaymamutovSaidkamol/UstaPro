import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
// import { UsersService } from './users.service';
import {
  RegisterDto,
  LoginDto,
  VerifyDto,
  sendOtpDto,
  resetPasswordDto,
} from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enums/role.enum';
import { RoleGuard } from 'src/auth/role.guard';
import {
  UpdateUserForAdminDto,
  UpdateUserForUserDto,
} from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryUserDto } from './dto/user-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('/query')
    @ApiOperation({
      summary: 'Userlarni qidirish',
      description:
        'Berilgan parametrlar bo‘yicha userlarni filterlash, sortlash, pagination',
    })
    @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
    @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
    query(@Query() query: QueryUserDto, @Req() req: Request) {
      return this.usersService.query(query, req);
    }


  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('active-user')
  ActiveUser() {
    return this.usersService.ActiveUser();
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('inactive-user')
  InActiveUser() {
    return this.usersService.InActiveUser();
  }

  @UseGuards(AuthGuard)
  @Get('/my-sessions')
  getSessions(@Req() req: Request) {
    return this.usersService.getSessions(req);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  GetMe(@Req() req: Request) {
    return this.usersService.GetMe(req);
  }

  @Post('/register')
  RegisterUser(@Body() data: RegisterDto) {
    return this.usersService.register(data);
  }

  
  @Post('/add-admin')
  AddAdmin(@Body() data: RegisterDto, @Req() req: Request) {
    return this.usersService.addAdmin(data, req);
  }

  @Post('/send-otp')
  sendOTP(@Body() phone: sendOtpDto) {
    return this.usersService.sendOtp(phone);
  }

  @Post('/verify')
  Verify(@Body() data: VerifyDto) {
    return this.usersService.verify(data);
  }

  @Post('/login')
  LoginUser(@Body() data: LoginDto, @Req() req: Request) {
    return this.usersService.login(data, req);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('/for-admin/:id')
  UpdateAdmin(@Param('id') id: string, @Body() data: UpdateUserForAdminDto) {
    return this.usersService.UpdateForAdmin(+id, data);
  }

  @UseGuards(AuthGuard)
  @Patch('/for-user/:id')
  UpdateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserForUserDto,
    @Req() req: Request,
  ) {
    return this.usersService.UpdateForUser(+id, data, req);
  }

  @UseGuards(AuthGuard)
  @Post('/resetPassword/send-Otp')
  sendOtp(@Body() data: sendOtpDto, @Req() req: Request) {
    return this.usersService.sendotpPassword(data, req);
  }

  @Post('/reset-password')
  resetPassword(@Body() data: resetPasswordDto) {
    return this.usersService.resetPassword(data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.usersService.remove(+id, req);
  }

  @UseGuards(AuthGuard) 
  @Delete('session:id')
  delSession(@Param('id') id: string, @Req() req: Request) {
    return this.usersService.delSession(+id, req);
  }
}
