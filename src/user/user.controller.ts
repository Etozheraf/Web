import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Req,
  ParseUUIDPipe,
  Redirect,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { CategoryService } from 'src/category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly categoryService: CategoryService) { }

  @Post('register')
  @Redirect()
  async register(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const user = await this.userService.register(createUserDto);
    req.session['user'] = {
      name: user.name,
      uuid: user.uuid
    };

    return {
      url: `/user/${user.uuid}`,
      statusCode: 302
    };
  }

  @Post('login')
  @Redirect()
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const user = await this.userService.login(loginDto);

    req.session['user'] = {
      name: user.name,
      uuid: user.uuid
    };

    return {
      url: `/user/${user.uuid}`,
      statusCode: 302
    };
  }

  @Post('logout')
  @Redirect('/')
  async logout(@Req() req: Request) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
    });
    return {
      url: '/',
      statusCode: 302
    };
  }

  @Get('api/:id')
  async findOneApi(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findOne(id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Get(':id')
  @Render('pages/user')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const [categories, user] = await Promise.all([
      this.categoryService.findAll(),
      this.userService.findOne(id),
    ]);

    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      user,
      menu,
    };
  }

  @Get('edit/:id')
  @Render('pages/user-edit')
  async showEditForm(@Param('id', ParseUUIDPipe) id: string) {
    const [categories, userToEdit] = await Promise.all([
      this.categoryService.findAll(),
      this.userService.findOne(id),
    ]);

    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      user: userToEdit,
      menu,
    };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!updateUserDto.currentPassword) {
      throw new BadRequestException('Необходимо ввести текущий пароль');
    }

    const user = await this.userService.findOne(id);
    const isPasswordValid = await this.userService.validatePassword(updateUserDto.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный текущий пароль');
    }

    delete updateUserDto.currentPassword;

    if (!updateUserDto.password) {
      delete updateUserDto.password;
    }

    await this.userService.update(id, updateUserDto);
    return {
      url: `/user/${id}`,
      statusCode: 302
    };
  }

  @Delete(':id')
  @Redirect('/')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    await this.userService.remove(id);
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
    });
    return {
      url: '/',
      statusCode: 302
    };
  }
}
