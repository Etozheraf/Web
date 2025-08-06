import {
    Controller,
    Post,
    Delete,
    Body,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiBody,
    ApiResponse,
    ApiSecurity,
} from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';

@ApiTags('Storage')
@Controller('api/storage')
@ApiSecurity('session')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
export class StorageApiController {
    constructor(private readonly storageService: StorageService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: 'Загрузить файл',
        description: 'Загружает файл в облачное хранилище и возвращает URL',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Файл для загрузки',
                },
                folder: {
                    type: 'string',
                    description: 'Папка для сохранения файла',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Файл успешно загружен',
        schema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'URL загруженного файла',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Некорректный файл',
    })
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder?: string,
    ) {
        if (!file) {
            throw new BadRequestException('Файл не предоставлен');
        }

        const url = await this.storageService.uploadFile(file, folder);
        return { url };
    }

}