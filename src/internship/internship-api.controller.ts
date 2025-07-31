import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, ParseUUIDPipe } from '@nestjs/common';
import { InternshipService } from './internship.service';
import { CreateInternshipInput } from './dto/create-internship.input';
import { UpdateInternshipInput } from './dto/update-internship.input';

@Controller('api/internships')
export class InternshipApiController {
  constructor(private readonly internshipService: InternshipService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createInternshipInput: CreateInternshipInput) {
    return this.internshipService.create(createInternshipInput);
  }

  @Get()
  async findByCategory(@Query('category') categoryName: string) {
    return this.internshipService.findByCategory(categoryName);
  }

  @Get(':uuid')
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.internshipService.findOne(uuid);
  }

  @Patch(':uuid')
  async update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateInternshipInput: UpdateInternshipInput) {
    return this.internshipService.update(uuid, updateInternshipInput);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.internshipService.remove(uuid);
  }
} 