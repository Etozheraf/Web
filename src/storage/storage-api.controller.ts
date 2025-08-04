import {
    Controller,
    Post,
    Delete,
    Body,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiBody,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';
import { StorageService } from './storage.service';

@ApiTags('Storage')
@Controller('api/storage')
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