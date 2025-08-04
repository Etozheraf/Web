import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageApiController } from './storage-api.controller';

@Module({
  controllers: [StorageApiController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
