import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  Header,
} from '@nestjs/common';
import { InternshipService } from './internship.service';
import { CreateInternshipInput } from './dto/create-internship.input';
import { UpdateInternshipInput } from './dto/update-internship.input';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Internship } from './entities/internship.entity';
import { EtagInterceptor } from '../common/interceptors/etag.interceptor';

@ApiTags('internships')
@Controller('api/internships')
export class InternshipApiController {
  constructor(private readonly internshipService: InternshipService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new internship' })
  @ApiBody({ type: CreateInternshipInput })
  @ApiResponse({
    status: 201,
    description: 'The internship has been successfully created.',
    type: Internship,
  })
  @ApiResponse({ status: 409, description: 'Internship already exists.' })
  async create(@Body() createInternshipInput: CreateInternshipInput) {
    return this.internshipService.create(createInternshipInput);
  }

  @Get()
  @UseInterceptors(EtagInterceptor)
  @Header('Cache-Control', 'public, max-age=3600')
  @ApiOperation({
    summary: 'Get all internships, optionally filtered by category',
  })
  @ApiQuery({
    name: 'category',
    required: true,
    type: String,
    description: 'Filter internships by category name',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all internships.',
    type: [Internship],
  })
  @ApiResponse({
    status: 400,
    description: 'Category is required for finding internships',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 304, description: 'Not Modified' })
  async findByCategory(@Query('category') categoryName: string) {
    return this.internshipService.findByCategory(categoryName);
  }

  @Get(':uuid')
  @UseInterceptors(EtagInterceptor)
  @Header('Cache-Control', 'public, max-age=3600')
  @ApiOperation({ summary: 'Get an internship by uuid' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the internship',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Return the internship.',
    type: Internship,
  })
  @ApiResponse({ status: 404, description: 'Internship not found.' })
  @ApiResponse({ status: 304, description: 'Not Modified' })
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.internshipService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update an internship' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the internship',
    required: true,
  })
  @ApiBody({ type: UpdateInternshipInput })
  @ApiResponse({
    status: 200,
    description: 'The internship has been successfully updated.',
    type: Internship,
  })
  @ApiResponse({ status: 404, description: 'Internship not found.' })
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateInternshipInput: UpdateInternshipInput,
  ) {
    return this.internshipService.update(uuid, updateInternshipInput);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an internship' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the internship',
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'The internship has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Internship not found.' })
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.internshipService.remove(uuid);
  }
}