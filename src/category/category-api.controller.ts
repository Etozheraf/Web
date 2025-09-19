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
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';


@ApiSecurity('session')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
@ApiTags('categories')
@Controller('api/categories')
export class CategoryApiController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: Category,
  })
  @ApiResponse({ status: 409, description: 'Category already exists.' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
    type: [Category],
  })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a category by uuid' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the category',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Return the category.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.categoryService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the category',
    required: true,
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(uuid, updateCategoryDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the category',
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.categoryService.remove(uuid);
  }
}
