import { Global, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagApiController } from './tag-api.controller';
import { TagGraphQLResolver } from './tag-graphql.resolver';
import { CategoryModule } from '../category/category.module';

@Global()
@Module({
  imports: [CategoryModule],
  controllers: [TagController, TagApiController],
  providers: [TagService, TagGraphQLResolver],
  exports: [TagService],
})
export class TagModule {}
