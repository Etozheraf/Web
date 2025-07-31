import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Render,
  Res,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
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
  ) { }

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
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.session['user'];
    if (!user) {
      return res.status(401).render('pages/error', { message: 'Необходимо авторизоваться' });
    }

    if (!createRequestDto.internshipName) {
      return res.status(400).render('pages/error', { message: 'Необходимо указать название стажировки' });
    }

    if (!createRequestDto.category) {
      return res.status(400).render('pages/error', { message: 'Необходимо выбрать категорию' });
    }
    
    const internship = await this.internshipService.findByNameAndCategory(
      createRequestDto.internshipName, 
      createRequestDto.category
    );
    if (!internship) {
      return res.status(404).render('pages/error', { message: 'Стажировка не найдена в указанной категории' });
    }

    createRequestDto.userUuid = user.uuid;
    createRequestDto.internshipUuid = internship.uuid;

    await this.requestService.create(createRequestDto);
    return res.redirect('/requests');
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    await this.requestService.remove(id);
    return res.redirect('/requests');
  }
}
