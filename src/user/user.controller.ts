import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Res,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { CategoryService } from 'src/category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly categoryService: CategoryService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Req() req: Request, @Res() res: Response) {
    const user = await this.userService.register(createUserDto);
    req.session['user'] = {
      name: user.name,
      uuid: user.uuid
    };

    return res.redirect(`/user/${user.uuid}`);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
    const user = await this.userService.login(loginDto);

    req.session['user'] = {
      name: user.name,
      uuid: user.uuid
    };

    return res.redirect(`/user/${user.uuid}`);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
    });
    return res.redirect('/');
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
  async showEditForm(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    try {
      const [categories, userToEdit] = await Promise.all([
        this.categoryService.findAll(),
        this.userService.findOne(id),
      ]);

      const menu = categories.map(
        (category) => new ResponseCategoryDto(category, ''),
      );

      return res.render('pages/user-edit', { user: userToEdit, menu });
    } catch {
      return res
        .status(404)
        .render('pages/error', { message: 'User not found' });
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    try {
      if (!updateUserDto.currentPassword) {
        return res.status(400).render('pages/error', { message: 'Необходимо ввести текущий пароль' });
      }

      const user = await this.userService.findOne(id);
      const isPasswordValid = await this.userService.validatePassword(updateUserDto.currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).render('pages/error', { message: 'Неверный текущий пароль' });
      }

      delete updateUserDto.currentPassword;
      
      if (!updateUserDto.password) {
        delete updateUserDto.password;
      }

      await this.userService.update(id, updateUserDto);
      return res.redirect(`/user/${id}`);
    } catch (error) {
      return res.status(500).render('pages/error', { message: 'Ошибка при обновлении профиля' });
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response, @Req() req: Request) {
    await this.userService.remove(id);
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
    });
    return res.redirect('/');
  }
}
