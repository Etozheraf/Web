import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseCategoryDto } from './dto/response.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const user = req.session['user'];
    const categories = await this.categoryService.findAll();
    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return res.render('pages/category-index', {
      categories,
      menu,
      user,
    });
  }

  @Get('add')
  async showAddForm(@Res() res: Response, @Req() req: Request) {
    const user = req.session['user'];
    const rawCategories = await this.categoryService.findAll();
    const menu = rawCategories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return res.render('pages/category-add', {
      menu,
      user,
    });
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
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string, @Res() res: Response, @Req() req: Request) {
    const user = req.session['user'];
    try {
      const [rawCategories, category] = await Promise.all([
        this.categoryService.findAll(),
        this.categoryService.findOne(uuid),
      ]);

      const menu = rawCategories.map(
        (cat) => new ResponseCategoryDto(cat, ''),
      );

      return res.render('pages/category-detail', { category, menu, user });
    } catch {
      return res
        .status(404)
        .render('pages/error', { message: 'Category not found' });
    }
  }

  @Get('edit/:uuid')
  async showEditForm(@Param('uuid', ParseUUIDPipe) uuid: string, @Res() res: Response, @Req() req: Request) {
    const user = req.session['user'];
    try {
      const [rawCategories, category] = await Promise.all([
        this.categoryService.findAll(),
        this.categoryService.findOne(uuid),
      ]);

      const menu = rawCategories.map(
        (cat) => new ResponseCategoryDto(cat, ''),
      );

      return res.render('pages/category-edit', { category, menu, user });
    } catch {
      return res
        .status(404)
        .render('pages/error', { message: 'Category not found' });
    }
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
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Res() res: Response) {
    await this.categoryService.remove(uuid);
    return res.redirect('/category');
  }
} 