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
} from '@nestjs/common';
import { Response, Request } from 'express';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ResponseTagDto } from './dto/response.dto';
import { CategoryService } from '../category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';

@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const user = req.session['user'];
    const [tags, rawCategories] = await Promise.all([
      this.tagService.findAll(),
      this.categoryService.findAll(),
    ]);
    const menu = rawCategories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return res.render('pages/tag-index', {
      tags,
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

    return res.render('pages/tag-add', {
      menu,
      user,
    });
  }

  @Post()
  async create(@Body() createTagDto: CreateTagDto, @Res() res: Response) {
    await this.tagService.create(createTagDto);
    return res.redirect('/tag');
  }

  @Get('detail/:uuid')
  async findOne(
    @Param('uuid') uuid: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.session['user'];
    try {
      const [rawCategories, tag] = await Promise.all([
        this.categoryService.findAll(),
        this.tagService.findOne(uuid),
      ]);

      const menu = rawCategories.map(
        (category) => new ResponseCategoryDto(category, ''),
      );

      return res.render('pages/tag-detail', { tag, menu, user });
    } catch {
      return res
        .status(404)
        .render('pages/error', { message: 'Tag not found' });
    }
  }

  @Get('edit/:uuid')
  async showEditForm(
    @Param('uuid') uuid: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.session['user'];
    try {
      const [rawCategories, tag] = await Promise.all([
        this.categoryService.findAll(),
        this.tagService.findOne(uuid),
      ]);

      const menu = rawCategories.map(
        (category) => new ResponseCategoryDto(category, ''),
      );

      return res.render('pages/tag-edit', { tag, menu, user });
    } catch {
      return res
        .status(404)
        .render('pages/error', { message: 'Tag not found' });
    }
  }

  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateTagDto: UpdateTagDto,
    @Res() res: Response,
  ) {
    await this.tagService.update(uuid, updateTagDto);
    return res.redirect('/tag');
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string, @Res() res: Response) {
    await this.tagService.remove(uuid);
    return res.redirect('/tag');
  }
} 