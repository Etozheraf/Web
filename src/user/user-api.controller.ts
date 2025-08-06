import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';

@ApiSecurity('session')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
@ApiTags('users')
@Controller('api/users')
export class UserApiController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get a user by uuid' })
  @ApiParam({
    name: 'uuid',
    required: true,
    description: 'The UUID of the user',
  })
  @ApiResponse({ status: 200, description: 'Return the user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({
    name: 'uuid',
    required: true,
    description: 'The UUID of the user',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'uuid',
    required: true,
    description: 'The UUID of the user',
  })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.remove(uuid);
  }
}
