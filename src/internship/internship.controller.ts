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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
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
    @Body() createInternshipDto: CreateInternshipDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (file) {
      createInternshipDto.imgUrl = `/img/${file.filename}`;
    }

    createInternshipDto.closed = (createInternshipDto.closed as any) === 'true';

    const internship = await this.internshipService.create(createInternshipDto);
    return res.redirect(`/internship?category=${internship.category.name}`);
  }

  @Get('detail/:uuid')
  async findOne(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      const [categories, internship] = await Promise.all([
        this.categoryService.findAll(),
        this.internshipService.findOne(uuid),
      ]);

      const menu = categories.map(
        (category) => new ResponseCategoryDto(category, ''),
      );

      return res.render('pages/internship-detail', { internship, menu });
    } catch {
      return res
        .status(404)
        .render('pages/error', { message: 'Internship not found' });
    }
  }

  @Get('edit/:uuid')
  async showEditForm(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      const [categories, internship] = await Promise.all([
        this.categoryService.findAll(),
        this.internshipService.findOne(uuid),
      ]);

      const menu = categories.map(
        (category) => new ResponseCategoryDto(category, ''),
      );

      return res.render('pages/internship-edit', { internship, menu });
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
    @Body() updateInternshipDto: UpdateInternshipDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (file) {
      updateInternshipDto.imgUrl = `/img/${file.filename}`;
    } 

    updateInternshipDto.closed = (updateInternshipDto.closed as any) === 'true';

    delete (updateInternshipDto as any)._method;
    delete (updateInternshipDto as any).imageFile;

    const category = updateInternshipDto.category;
    await this.internshipService.update(uuid, updateInternshipDto);
    return res.redirect(`/internship?category=${category}`);
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string, @Res() res: Response) {
    const internship = await this.internshipService.findOne(uuid);
    await this.internshipService.remove(uuid);
    return res.redirect(`/internship?category=${internship.category.name}`);
  }
}
