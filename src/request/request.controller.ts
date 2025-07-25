import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Render,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { InternshipService } from '../internship/internship.service';
import { CategoryService } from '../category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';

@Controller('requests')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly internshipService: InternshipService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  @Render('pages/form')
  async showUserRequestsPage(@Query('auth') auth: string) {
    const isAuthorized = auth === 'Rafael';
    let user: number;
    if (isAuthorized) {
      user = 1;
    } else {
      return {};
    }

    const [categories, myRequests] = await Promise.all([
      this.categoryService.findAll(),
      this.requestService.findByUser(user),
    ]);

    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      menu,
      myRequests,
    };
  }

  @Post()
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Res() res: Response,
  ) {
    await this.requestService.create(createRequestDto);
    return res.redirect('/requests');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.requestService.remove(+id);
    return res.redirect('/requests');
  }
}
