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
} from '@nestjs/common';
// import { UsersService } from './users.service';
import { RegisterDto, LoginDto, VerifyDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enums/role.enum';
import { RoleGuard } from 'src/auth/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  RegisterUser(@Body() data: RegisterDto) {
    return this.usersService.register(data);
  }

  @Post('/verify')
  Verify(@Body() data: VerifyDto) {
    return this.usersService.verify(data);
  }

  @Post('/login')
  LoginUser(@Body() data: LoginDto) {
    return this.usersService.login(data);
  }

  // // @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @UseGuards(AuthGuard)
  // @Get('/me')
  // GetMe(@Req() req: Request) {
  //   return this.usersService.GetMe(req);
  // }

  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard, RoleGuard)
  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.usersService.findOne(id);
  // }

  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // @UseGuards(AuthGuard, RoleGuard)
  // @Patch(':id')
  // Update(
  //   @Param('id') id: number,
  //   @Body() data: UpdateUserDto,
  //   @Req() req: Request,
  // ) {
  //   return this.usersService.Update(id, data, req);
  // }

  // @UseGuards(AuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: number, @Req() req: Request) {
  //   return this.usersService.remove(id, req);
  // }
}
