import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Req,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { CategoryService } from 'src/category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import Session from 'supertokens-node/recipe/session';
import SuperTokens from 'supertokens-node';

@ApiExcludeController()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly categoryService: CategoryService) { }

  @Get('api')
  async findOneApi(@Req() req: Request) {
    const session = await Session.getSession(req, req.res);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const authId = session.getUserId();
    const user = await this.userService.findByAuthId(authId);
    return user;
  }

  @Get()
  @Render('pages/user')
  async findOne(@Req() req: Request) {
    const session = await Session.getSession(req, req.res);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const authId = session.getUserId();

    const categories = await this.categoryService.findAll();
    const user = await this.userService.findByAuthId(authId);

    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      user,
      menu,
    };
  }

  @Get('edit')
  @Render('pages/user-edit')
  async showEditForm(@Req() req: Request) {
    const session = await Session.getSession(req, req.res);
    const authId = session.getUserId();
    const categories = await this.categoryService.findAll();
    const userToEdit = await this.userService.findByAuthId(authId);

    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      user: userToEdit,
      menu,
    };
  }

  @Patch('')
  @Redirect('/user')
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    console.log("updateUserDto", updateUserDto);

    const session = await Session.getSession(req, req.res);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const authId = session.getUserId();
    await this.userService.updateByAuthId(authId, updateUserDto);
    return;
  }

  @Delete()
  @Redirect('/')
  async remove(@Req() req: Request) {
    const session = await Session.getSession(req, req.res);
    const authId = session.getUserId();
    await this.userService.removeByAuthId(authId);
    await SuperTokens.deleteUser(authId);
    return;
  }
}
