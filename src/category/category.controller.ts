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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseCategoryDto } from './dto/response.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import Session from 'supertokens-node/recipe/session';
import { UserService } from 'src/user/user.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@ApiExcludeController()
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Render('pages/category-index')
  async findAll(@Req() req: Request, @Res() res: Response) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;

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
  @Redirect('/category')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoryService.create(createCategoryDto);
    return {
      url: '/category',
      statusCode: 302
    };
  }

  @Get('detail/:uuid')
  @Render('pages/category-detail')
  async findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;
    
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
    @Res() res: Response,
  ) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;
    
    const [rawCategories, category] = await Promise.all([
      this.categoryService.findAll(),
      this.categoryService.findOne(uuid),
    ]);

    const menu = rawCategories.map((cat) => new ResponseCategoryDto(cat, ''));

    return { category, menu, user };
  }

  @Patch(':uuid')
  @Redirect('/category')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoryService.update(uuid, updateCategoryDto);
    return {
      url: '/category',
      statusCode: 302
    };
  }

  @Delete(':uuid')
  @Redirect('/category')
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    await this.categoryService.remove(uuid);
    return {
      url: '/category',
      statusCode: 302
    };
  }
}
