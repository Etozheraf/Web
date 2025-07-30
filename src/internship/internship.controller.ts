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
  UseInterceptors,
  UploadedFile,
  Req,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { ResponseInternshipDto } from './dto/response-intership.dto';
import { CategoryService } from 'src/category/category.service';
import { ResponseCategoryDto } from '../category/dto/response.dto';
import { TagService } from 'src/tag/tag.service';
import { CreateInternshipInput } from './dto/create-internship.input';
import { UpdateInternshipInput } from './dto/update-internship.input';

@Controller('internship')
export class InternshipController {
  constructor(
    private readonly internshipService: InternshipService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) { }

  @Get()
  async findByCategory(
    @Query('category') categoryName: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.session['user'];

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
      user,
    });
  }

  @Get('add')
  async showAddForm(@Res() res: Response, @Req() req: Request) {
    const user = req.session['user'];
    const [categories, tags] = await Promise.all([
      this.categoryService.findAll(),
      this.tagService.findAll(),
    ]);
    const menu = categories.map(
      (category) => new ResponseCategoryDto(category, ''),
    );

    return res.render('pages/internship-add', {
      menu,
      tags,
      user,
    });
  }

  @Post('')
  @UseInterceptors(
    FileInterceptor('imageFile', {
      storage: diskStorage({
        destination: './public/img',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() formDto: CreateInternshipDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const imgUrl = file ? `/img/${file.filename}` : '';

    const input: CreateInternshipInput = {
      name: formDto.name,
      companyUrl: formDto.companyUrl,
      date: formDto.date ?? '',
      closed: formDto.closed === 'true',
      categoryName: formDto.category,
      tags: (formDto.tags ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      imgUrl,
    };

    const internship = await this.internshipService.create(input);
    return res.redirect(`/internship?category=${internship.category.name}`);
  }

  @Get('detail/:uuid')
  async findOne(@Param('uuid') uuid: string, @Res() res: Response, @Req() req: Request) {
    const user = req.session['user'];
    try {
      const [categories, internship] = await Promise.all([
        this.categoryService.findAll(),
        this.internshipService.findOne(uuid),
      ]);

      const menu = categories.map(
        (category) => new ResponseCategoryDto(category, ''),
      );

      return res.render('pages/internship-detail', { internship, menu, user });
    } catch {
      return res
        .status(404)
        .render('pages/error', { message: 'Internship not found' });
    }
  }

  @Get('edit/:uuid')
  async showEditForm(@Param('uuid') uuid: string, @Res() res: Response, @Req() req: Request) {
    const user = req.session['user'];
    try {
      const [categories, internship, tags] = await Promise.all([
        this.categoryService.findAll(),
        this.internshipService.findOne(uuid),
        this.tagService.findAll(),
      ]);

      const menu = categories.map(
        (category) => new ResponseCategoryDto(category, ''),
      );

      return res.render('pages/internship-edit', { internship, menu, tags, user });
    } catch {
      return res
        .status(404)
        .render('pages/error', { message: 'Internship not found' });
    }
  }

  @Patch(':uuid')
  @UseInterceptors(
    FileInterceptor('imageFile', {
      storage: diskStorage({
        destination: './public/img',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async update(
    @Param('uuid') uuid: string,
    @Body() formDto: UpdateInternshipDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const imgUrl = file ? `/img/${file.filename}` : undefined;

    const input: UpdateInternshipInput = {
      name: formDto.name,
      companyUrl: formDto.companyUrl,
      date: formDto.date,
      closed: formDto.closed === 'true',
      categoryName: formDto.category,
      tags: formDto.tags !== undefined
        ? formDto.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
      imgUrl,
    };

    await this.internshipService.update(uuid, input);
    return res.redirect(`/internship?category=${input.categoryName || 'all'}`);
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string, @Res() res: Response) {
    const internship = await this.internshipService.findOne(uuid);
    await this.internshipService.remove(uuid);
    return res.redirect(`/internship?category=${internship.category.name}`);
  }

  @Sse('sse')
  internshipEvents(): Observable<MessageEvent> {
    return this.internshipService.getEventsStream().pipe(
      map((event) => {
        return {
          data: JSON.stringify(event.internship),
          type: event.type,
          id: event.type, // добавляем id для идентификации типа события
        } as MessageEvent;
      })
    );
  }
}
