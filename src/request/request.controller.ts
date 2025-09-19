import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Res,
  Render,
  ParseUUIDPipe,
  Redirect,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { InternshipService } from '../internship/internship.service';
import { CategoryService } from '../category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import Session from 'supertokens-node/recipe/session';
import { UserService } from 'src/user/user.service';


@ApiExcludeController()
@Controller('requests')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly internshipService: InternshipService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Render('pages/form')
  async showUserRequestsPage(@Req() req: Request, @Res() res: Response) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const authId = session.getUserId();
    const user = await this.userService.findByAuthId(authId);
    const categories = await this.categoryService.findAll();
    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    const myRequests = await this.requestService.findByUser(user.uuid);

    return {
      menu,
      myRequests,
      user,
    };
  }

  @Post()
  @Redirect('/requests')
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const session = await Session.getSession(req, res);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }
    const authId = session.getUserId();
    const user = await this.userService.findByAuthId(authId);

    if (!createRequestDto.internshipName) {
      throw new BadRequestException('Необходимо указать название стажировки');
    }

    if (!createRequestDto.category) {
      throw new BadRequestException('Необходимо выбрать категорию');
    }

    const internship = await this.internshipService.findByNameAndCategory(
      createRequestDto.internshipName,
      createRequestDto.category,
    );
    if (!internship) {
      throw new NotFoundException('Стажировка не найдена в указанной категории');
    }

    await this.requestService.create(createRequestDto.name, createRequestDto.status, createRequestDto.dates, user.uuid, internship.uuid);
    return {
      url: '/requests',
      statusCode: 302
    };
  }

  @Delete(':id')
  @Redirect('/requests')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.requestService.remove(id);
    return {
      url: '/requests',
      statusCode: 302
    };
  }
}
