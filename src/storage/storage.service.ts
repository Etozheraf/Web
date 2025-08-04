import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly bucketUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('STORAGE_BUCKET') || '';
    this.bucketUrl = `https://${this.bucket}.storage.yandexcloud.net/`;
    this.s3 = new S3Client({
      endpoint: this.configService.get<string>('STORAGE_ENDPOINT') || '',
      region: this.configService.get<string>('STORAGE_REGION') || '',
      credentials: {
        accessKeyId: this.configService.get<string>('STORAGE_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>(
          'STORAGE_SECRET_ACCESS_KEY',
        ) || '',
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<string> {
    const fileName = `${folder ? folder + '/' : ''}${uuid()}-${
      file.originalname
    }`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${this.bucketUrl}${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl || !fileUrl.startsWith(this.bucketUrl)) {
      return;
    }

    const key = fileUrl.replace(this.bucketUrl, '');

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}