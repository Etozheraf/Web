import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Query, ParseUUIDPipe } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Controller('api/requests')
export class RequestApiController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  async findByUser(@Query('userUuid', ParseUUIDPipe) userUuid: string) {
    return this.requestService.findByUser(userUuid);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.requestService.remove(uuid);
  }
} 