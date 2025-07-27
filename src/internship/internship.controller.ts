import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { ResponseInternshipDto } from './dto/response-intership.dto';
import { CategoryService } from 'src/category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';

@Controller('internship')
export class InternshipController {
  constructor(
    private readonly internshipService: InternshipService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  async findByCategory(
    @Query('category') categoryName: string,
    @Res() res: Response,
  ) {
    const [rawInternships, categories] = await Promise.all([
      this.internshipService.findByCategory(categoryName),
      this.categoryService.findAll(),
    ]);

    const internships = rawInternships.map(
      (internship) => new ResponseInternshipDto(internship),
    );
    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, categoryName),
    );

    return res.render('pages/internships', {
      internships,
      menu,
    });
  }

  @Get('add')
  async showAddForm(@Res() res: Response) {
    const categories = await this.categoryService.findAll();
    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return res.render('pages/internship-add', {
      menu,
    });
  }

  @Post('')
  async create(
    @Body() createInternshipDto: CreateInternshipDto,
    @Res() res: Response,
  ) {
    const internship = await this.internshipService.create(createInternshipDto);
    return res.redirect(`/internship/${internship.category.name}`);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const internship = await this.internshipService.findOne(id);
      return res.render('pages/internship-detail', { internship });
    } catch {
      return res
        .status(404)
        .render('pages/error', { message: 'Internship not found' });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInternshipDto: UpdateInternshipDto,
    @Res() res: Response,
  ) {
    const category = updateInternshipDto.category;
    await this.internshipService.update(id, updateInternshipDto);
    return res.redirect(`/internship/${category}`);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const category = await this.internshipService.findOne(id);
    await this.internshipService.remove(id);
    return res.redirect(`/internship/${category.name}`);
  }
}
