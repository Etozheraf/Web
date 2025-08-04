import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Render,
  Req,
  ParseUUIDPipe,
  Redirect,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { InternshipService } from '../internship/internship.service';
import { CategoryService } from '../category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('requests')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly internshipService: InternshipService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  @Render('pages/form')
  async showUserRequestsPage(@Req() req: Request) {
    const user = req.session['user'];
    const categories = await this.categoryService.findAll();
    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    if (!user) {
      return {
        menu,
      };
    }

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
  ) {
    const user = req.session['user'];
    if (!user) {
      throw new UnauthorizedException('Необходимо авторизоваться');
    }

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

    createRequestDto.userUuid = user.uuid;
    createRequestDto.internshipUuid = internship.uuid;

    await this.requestService.create(createRequestDto);
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
