import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Sse,
  MessageEvent,
  ParseUUIDPipe,
  Render,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { ResponseInternshipDto } from './dto/response-intership.dto';
import { CategoryService } from 'src/category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';
import { TagService } from 'src/tag/tag.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { FileUpdateImageStrategy } from './strategy/update-image.strategy';
import { FileCreateImageStrategy } from './strategy/create-image.strategy';
import Session from 'supertokens-node/recipe/session';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@ApiExcludeController()
@Controller('internship')
export class InternshipController {
  constructor(
    private readonly internshipService: InternshipService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly userService: UserService,
  ) {}

  @PublicAccess()
  @Get()
  @Render('pages/internships')
  async findByCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Query('category') categoryName: string,
  ) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;

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

    return {
      internships,
      menu,
      user,
    };
  }

  @Get('add')
  @Roles(Role.Admin)
  @Render('pages/internship-add')
  @UseGuards(RolesGuard)
  async showAddForm(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;
    
    const [categories, tags] = await Promise.all([
      this.categoryService.findAll(),
      this.tagService.findAll(),
    ]);
    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      menu,
      tags,
      user,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('')
  @UseInterceptors(FileInterceptor('imageFile', { storage: memoryStorage() }))
  @Redirect('/internship')
  async create(
    @Body() formDto: CreateInternshipDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg|webp)' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const input = {
      name: formDto.name,
      companyUrl: formDto.companyUrl,
      date: formDto.date ?? '',
      closed: formDto.closed,
      categoryName: formDto.category,
      tags: (formDto.tags ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const internship = await this.internshipService.create(input, new FileCreateImageStrategy(file));
    return {
      url: `/internship?category=${internship.category.name}`,
      statusCode: 302
    };
  }


  @PublicAccess()
  @Get('detail/:uuid')
  @Render('pages/internship-detail')
  async findOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;
    
    const [categories, internship] = await Promise.all([
      this.categoryService.findAll(),
      this.internshipService.findOne(uuid),
    ]);

    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return { internship, menu, user };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('edit/:uuid')
  @Render('pages/internship-edit')
  async showEditForm(
    @Req() req: Request,
    @Res() res: Response,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    const authId = session?.getUserId();
    const user = authId ? await this.userService.findByAuthId(authId) : null;
    
    const [categories, internship, tags] = await Promise.all([
      this.categoryService.findAll(),
      this.internshipService.findOne(uuid),
      this.tagService.findAll(),
    ]);

    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return {
      internship,
      menu,
      tags,
      user,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':uuid')
  @UseInterceptors(FileInterceptor('imageFile', { storage: memoryStorage() }))
  @Redirect('/internship')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() formDto: UpdateInternshipDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const input = {
      name: formDto.name,
      companyUrl: formDto.companyUrl,
      date: formDto.date,
      closed: formDto.closed,
      categoryName: formDto.category,
      tags:
        formDto.tags !== undefined
          ? formDto.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
    };

    await this.internshipService.update(uuid, input, new FileUpdateImageStrategy(file));
    return {
      url: `/internship?category=${input.categoryName || 'all'}`,
      statusCode: 302
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':uuid')
  @Redirect('/internship')
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    const internship = await this.internshipService.findOne(uuid);
    await this.internshipService.remove(uuid);
    return {
      url: `/internship?category=${internship.category.name}`,
      statusCode: 302
    };
  }

  @PublicAccess()
  @Sse('sse')
  internshipEvents(): Observable<MessageEvent> {
    return this.internshipService.getEventsStream().pipe(
      map((event) => {
        return {
          data: JSON.stringify(event.internship),
          type: event.type,
          id: event.type,
        } as MessageEvent;
      }),
    );
  }
}
