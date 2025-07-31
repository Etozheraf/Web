import { Global, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagApiController } from './tag-api.controller';
import { CategoryModule } from '../category/category.module';

@Global()
@Module({
  imports: [CategoryModule],
  controllers: [TagController, TagApiController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
