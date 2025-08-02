import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
  Render,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseCategoryDto } from './dto/response.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Render('pages/category-index')
  async findAll(@Req() req: Request) {
    const user = req.session['user'];
    const categories = await this.categoryService.findAll();
    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      categories,
      menu,
      user,
    };
  }

  @Get('add')
  @Render('pages/category-add')
  async showAddForm(@Req() req: Request) {
    const user = req.session['user'];
    const rawCategories = await this.categoryService.findAll();
    const menu = rawCategories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      menu,
      user,
    };
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    await this.categoryService.create(createCategoryDto);
    return res.redirect('/category');
  }

  @Get('detail/:uuid')
  @Render('pages/category-detail')
  async findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: Request,
  ) {
    const user = req.session['user'];
    const [rawCategories, category] = await Promise.all([
      this.categoryService.findAll(),
      this.categoryService.findOne(uuid),
    ]);

    const menu = rawCategories.map((cat) => new ResponseCategoryDto(cat, ''));

    return { category, menu, user };
  }

  @Get('edit/:uuid')
  @Render('pages/category-edit')
  async showEditForm(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: Request,
  ) {
    const user = req.session['user'];
    const [rawCategories, category] = await Promise.all([
      this.categoryService.findAll(),
      this.categoryService.findOne(uuid),
    ]);

    const menu = rawCategories.map((cat) => new ResponseCategoryDto(cat, ''));

    return { category, menu, user };
  }

  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    await this.categoryService.update(uuid, updateCategoryDto);
    return res.redirect('/category');
  }

  @Delete(':uuid')
  async remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Res() res: Response,
  ) {
    await this.categoryService.remove(uuid);
    return res.redirect('/category');
  }
}
