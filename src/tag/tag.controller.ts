import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  ParseUUIDPipe,
  Render,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CategoryService } from '../category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import Session from 'supertokens-node/recipe/session';
import { UserService } from 'src/user/user.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@ApiExcludeController()
@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Render('pages/tag-index')
  async findAll(@Req() req: Request, @Res() res: Response) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;
    
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
  async showAddForm(@Req() req: Request, @Res() res: Response) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;

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
  @Redirect('/tag')
  async create(@Body() createTagDto: CreateTagDto) {
    await this.tagService.create(createTagDto);
    return {
      url: '/tag',
      statusCode: 302
    };
  }

  @Get('detail/:uuid')
  @Render('pages/tag-detail')
  async findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;
    
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
    @Res() res: Response,
  ) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;
    
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
  @Redirect('/tag')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    await this.tagService.update(uuid, updateTagDto);
    return {
      url: '/tag',
      statusCode: 302
    };
  }

  @Delete(':uuid')
  @Redirect('/tag')
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    await this.tagService.remove(uuid);
    return {
      url: '/tag',
      statusCode: 302
    };
  }
}
