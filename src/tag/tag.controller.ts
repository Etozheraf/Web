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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CategoryService } from '../category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  @Render('pages/tag-index')
  async findAll(@Req() req: Request) {
    const user = req.session['user'];
    const [tags, rawCategories] = await Promise.all([
      this.tagService.findAll(),
      this.categoryService.findAll(),
    ]);
    const menu = rawCategories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      tags,
      menu,
      user,
    };
  }

  @Get('add')
  @Render('pages/tag-add')
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
  async create(@Body() createTagDto: CreateTagDto, @Res() res: Response) {
    await this.tagService.create(createTagDto);
    return res.redirect('/tag');
  }

  @Get('detail/:uuid')
  @Render('pages/tag-detail')
  async findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: Request,
  ) {
    const user = req.session['user'];
    const [rawCategories, tag] = await Promise.all([
      this.categoryService.findAll(),
      this.tagService.findOne(uuid),
    ]);

    const menu = rawCategories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return { tag, menu, user };
  }

  @Get('edit/:uuid')
  @Render('pages/tag-edit')
  async showEditForm(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: Request,
  ) {
    const user = req.session['user'];
    const [rawCategories, tag] = await Promise.all([
      this.categoryService.findAll(),
      this.tagService.findOne(uuid),
    ]);

    const menu = rawCategories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return { tag, menu, user };
  }

  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateTagDto: UpdateTagDto,
    @Res() res: Response,
  ) {
    await this.tagService.update(uuid, updateTagDto);
    return res.redirect('/tag');
  }

  @Delete(':uuid')
  async remove(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Res() res: Response,
  ) {
    await this.tagService.remove(uuid);
    return res.redirect('/tag');
  }
}
