import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Query, ParseUUIDPipe } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Request } from './entities/request.entity';

@ApiTags('requests')
@Controller('api/requests')
export class RequestApiController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new request' })
  @ApiBody({ type: CreateRequestDto })
  @ApiResponse({ status: 201, description: 'The request has been successfully created.', type: Request })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all requests for a user' })
  @ApiQuery({ name: 'userUuid', required: true, type: String, description: 'The UUID of the user' })
  @ApiResponse({ status: 200, description: 'Return all requests for the user.', type: [Request] })
  async findByUser(@Query('userUuid', ParseUUIDPipe) userUuid: string) {
    return this.requestService.findByUser(userUuid);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a request' })
  @ApiParam({ name: 'uuid', required: true, description: 'The UUID of the request' })
  @ApiResponse({ status: 204, description: 'The request has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Request not found.' })
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.requestService.remove(uuid);
  }
}
