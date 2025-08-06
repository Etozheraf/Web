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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Tag } from './entities/tag.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@ApiTags('tags')
@Controller('api/tags')
export class TagApiController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
    type: Tag,
  })
  @ApiResponse({ status: 409, description: 'Tag already exists' })
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Return all tags.', type: [Tag] })
  async findAll() {
    return this.tagService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a tag by uuid' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the tag',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Return the tag.', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.tagService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the tag',
    required: true,
  })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully updated.',
    type: Tag,
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(uuid, updateTagDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the tag',
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'The tag has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.tagService.remove(uuid);
  }
}
