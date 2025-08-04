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
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InternshipService } from './internship.service';
import { CreateInternshipInput } from './dto/create-internship.input';
import { UpdateInternshipInput } from './dto/update-internship.input';
import {
  ApiExtraModels,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  getSchemaPath,
} from '@nestjs/swagger';
import { Internship } from './entities/internship.entity';
import { EtagInterceptor } from '../common/interceptors/etag.interceptor';
import { memoryStorage } from 'multer';
import { FileCreateImageStrategy } from './strategy/create-image.strategy';
import { FileUpdateImageStrategy } from './strategy/update-image.strategy';

@ApiTags('internships')
@Controller('api/internships')
@ApiExtraModels(CreateInternshipInput, UpdateInternshipInput)
export class InternshipApiController {
  constructor(private readonly internshipService: InternshipService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('imageFile', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new internship' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageFile: {
          type: 'string',
          format: 'binary',
          description: 'Image file (e.g., PNG, JPEG, SVG)',
          nullable: true,
        },
        data: {
          $ref: getSchemaPath(CreateInternshipInput),
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The internship has been successfully created.',
    type: Internship,
  })
  @ApiResponse({ status: 409, description: 'Internship already exists.' })
  async create(
    @Body() createInternshipInput: CreateInternshipInput,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg|webp)' }),
        ],
        fileIsRequired: true,
      }),
    )
    imageFile: Express.Multer.File,
  ) {
    return this.internshipService.create(createInternshipInput, new FileCreateImageStrategy(imageFile));
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
  @UseInterceptors(FileInterceptor('imageFile', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an internship' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    description: 'The uuid of the internship',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageFile: {
          type: 'string',
          format: 'binary',
          description: 'Image file (e.g., PNG, JPEG, SVG)',
          nullable: true,
        },
        data: {
          $ref: getSchemaPath(UpdateInternshipInput),
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The internship has been successfully updated.',
    type: Internship,
  })
  @ApiResponse({ status: 404, description: 'Internship not found.' })
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateInternshipInput: UpdateInternshipInput,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg|webp)' }),
        ],
        fileIsRequired: false,
      }),
    )
    imageFile?: Express.Multer.File,
  ) {
    return this.internshipService.update(
      uuid,
      updateInternshipInput,
      new FileUpdateImageStrategy(imageFile),
    );
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
