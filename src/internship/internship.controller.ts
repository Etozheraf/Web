import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, Redirect } from '@nestjs/common';
import { Response } from 'express';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { ResponseInternshipDto } from './dto/response-intership.dto';

@Controller('internship')
export class InternshipController {
  constructor(private readonly internshipService: InternshipService) {}

  @Get()
  async findDefaultCategory(@Res() res: Response) {
    return res.redirect('/internship/Backend');
  }

  @Get(':categoryName')
  async findByCategory(@Param('categoryName') categoryName: string, @Res() res: Response) {
    const [rawInternships, categories] = await Promise.all([
      this.internshipService.findByCategory(categoryName),
      this.internshipService.getCategories(),
    ]);

    const internships = rawInternships.map(internship => new ResponseInternshipDto(internship));
    const menu = categories.map(category => ({
      href: `/internship/${category.name}`,
      active: category.name === categoryName,
      label: category.name
    }));

    return res.render('pages/internships', { 
      internships, 
      menu,
    });
  }

  @Get('add/:id')
  async showAddForm(@Param('id') id: string, @Res() res: Response) {
    const internship = await this.internshipService.findOne(+id);
    return res.render('pages/add-internship', { internship });
  }

  @Post('')
  async create(@Body() createInternshipDto: CreateInternshipDto, @Res() res: Response) {
    const internship = await this.internshipService.create(createInternshipDto);
    return res.redirect(`/internship/${internship.category}`);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const internship = await this.internshipService.findOne(+id);
      return res.render('pages/internship-detail', { internship });
    } catch (error) {
      return res.status(404).render('pages/error', { message: 'Internship not found' });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateInternshipDto: UpdateInternshipDto, @Res() res: Response) {
    const category = updateInternshipDto.category;
    await this.internshipService.update(+id, updateInternshipDto);
    return res.redirect(`/internship/${category}`);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const category = await this.internshipService.findOne(+id);
    await this.internshipService.remove(+id);
    return res.redirect(`/internship/${category}`);
  }
}
